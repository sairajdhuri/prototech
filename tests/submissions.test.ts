import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/submissions/route";

const fields = { kind: "enquiry", fullName: "Sam Engineer", company: "Board Works", email: "sam@example.com", phone: "", requirements: "Please discuss our upcoming PCB project.", website: "" };
function request(values = fields, identity = crypto.randomUUID()) {
  const form = new FormData();
  for (const [key, value] of Object.entries(values)) form.set(key, value);
  return new Request("http://localhost:3000/api/submissions", { method: "POST", headers: { origin: "http://localhost:3000", "x-forwarded-for": identity }, body: form });
}
test("cross-origin requests reject", async () => {
  const response = await POST(new Request("http://localhost:3000/api/submissions", { method: "POST", headers: { origin: "https://unrelated.example" } }));
  assert.equal(response.status, 403);
});
test("invalid form receives field errors", async () => {
  const response = await POST(request({ ...fields, email: "invalid" }));
  assert.equal(response.status, 422);
  assert.ok((await response.json()).fields.email);
});
test("missing credentials never reports success", async () => {
  const originalKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    const response = await POST(request());
    assert.equal(response.status, 503); assert.equal((await response.json()).ok, false);
  } finally { if (originalKey) process.env.RESEND_API_KEY = originalKey; }
});
test("email acceptance is required for success; provider errors fail honestly", async () => {
  const saved = { key: process.env.RESEND_API_KEY, from: process.env.MAIL_FROM, fetch: globalThis.fetch };
  process.env.RESEND_API_KEY = "test-key"; process.env.MAIL_FROM = "website@example.com";
  try {
    globalThis.fetch = async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.reply_to, fields.email); assert.ok(body.text.includes(fields.requirements));
      return Response.json({ id: "accepted-email-id" });
    };
    const success = await POST(request());
    assert.equal(success.status, 200); assert.equal((await success.json()).id, "accepted-email-id");
    globalThis.fetch = async () => Response.json({ error: "Invalid sender" }, { status: 403 });
    const failure = await POST(request());
    assert.equal(failure.status, 503); assert.equal((await failure.json()).ok, false);
  } finally {
    globalThis.fetch = saved.fetch;
    if (saved.key) process.env.RESEND_API_KEY = saved.key; else delete process.env.RESEND_API_KEY;
    if (saved.from) process.env.MAIL_FROM = saved.from; else delete process.env.MAIL_FROM;
  }
});
test("request size limit rejects before reading payload", async () => {
  const value = request(); value.headers.set("content-length", String(7 * 1024 * 1024));
  assert.equal((await POST(value)).status, 413);
});
test("sixth submission is rate limited", async () => {
  const id = crypto.randomUUID();
  for (let i = 0; i < 5; i++) assert.notEqual((await POST(request({ ...fields, email: "invalid" }, id))).status, 429);
  assert.equal((await POST(request({ ...fields, email: "invalid" }, id))).status, 429);
});
test("malformed multipart body reports a request error", async () => {
  const response = await POST(new Request("http://localhost:3000/api/submissions", { method: "POST", headers: { origin: "http://localhost:3000", "content-type": "multipart/form-data; boundary=broken", "x-forwarded-for": crypto.randomUUID() }, body: "not multipart" }));
  assert.equal(response.status, 400);
});
test("quote attachments are validated and sent to the email provider", async () => {
  const saved = { key: process.env.RESEND_API_KEY, from: process.env.MAIL_FROM, fetch: globalThis.fetch };
  process.env.RESEND_API_KEY = "test-key"; process.env.MAIL_FROM = "website@example.com";
  try {
    const form = new FormData();
    const values = { ...fields, kind: "quote", phone: "+91 9999999999", pcbType: "multilayer", layers: "6", width: "100", height: "80", quantity: "50" };
    for (const [key, value] of Object.entries(values)) form.set(key, value);
    form.set("attachment", new File(["%PDF-1.7\nDesign requirements"], "design requirements.pdf", { type: "application/pdf" }));
    globalThis.fetch = async (_input, init) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.attachments[0].filename, "design_requirements.pdf");
      assert.ok(Buffer.from(body.attachments[0].content, "base64").toString().startsWith("%PDF-"));
      return Response.json({ id: "quote-email-id" });
    };
    const response = await POST(new Request("http://localhost:3000/api/submissions", { method: "POST", headers: { origin: "http://localhost:3000", "x-forwarded-for": crypto.randomUUID() }, body: form }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).id, "quote-email-id");
  } finally {
    globalThis.fetch = saved.fetch;
    if (saved.key) process.env.RESEND_API_KEY = saved.key; else delete process.env.RESEND_API_KEY;
    if (saved.from) process.env.MAIL_FROM = saved.from; else delete process.env.MAIL_FROM;
  }
});
