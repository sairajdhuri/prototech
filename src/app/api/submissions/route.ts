import { NextResponse } from "next/server";
import { enquirySchema, quoteSchema, MAX_FILE_BYTES, fileMetadataError, fileContentError } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { sendSubmission } from "@/lib/mail";
import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";
const maxBody = MAX_FILE_BYTES + 128 * 1024;
function error(message: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json({ ok: false, message, fields }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestUrl = new URL(request.url);
  const hostOrigin = request.headers.get("host") ? `${requestUrl.protocol}//${request.headers.get("host")}` : requestUrl.origin;
  if (!origin || ![requestUrl.origin, hostOrigin, new URL(siteUrl).origin].includes(origin) || request.headers.get("sec-fetch-site") === "cross-site") return error("Submit the form from the Prototech website.", 403);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data") && !contentType.startsWith("application/x-www-form-urlencoded")) return error("Submit a valid enquiry form.", 415);
  if (Number(request.headers.get("content-length")) > maxBody) return error("The request is too large. Keep attachments below 5 MB.", 413);
  try {
    const identity = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    if (!await rateLimit(identity)) return NextResponse.json({ ok: false, message: "Too many submissions. Wait 15 minutes, or email sales@protomlb.in." }, { status: 429, headers: { "Retry-After": "900", "Cache-Control": "no-store" } });
    const reader = request.body?.getReader();
    if (!reader) return error("The form was empty. Please fill it in and try again.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBody) { await reader.cancel(); return error("The request is too large. Keep attachments below 5 MB.", 413); }
      chunks.push(value);
    }
    let form: FormData;
    try { form = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": contentType } }).formData(); }
    catch { return error("The form could not be read. Reload the page and try again.", 400); }
    const raw = Object.fromEntries(form.entries());
    const schema = raw.kind === "quote" ? quoteSchema : enquirySchema;
    const result = schema.safeParse(raw);
    if (!result.success) {
      const fields: Record<string, string> = {};
      for (const issue of result.error.issues) fields[String(issue.path[0])] ||= issue.message;
      return error("Check the highlighted fields and try again.", 422, fields);
    }
    let attachment;
    const files = form.getAll("attachment");
    if (files.length > 1) return error("Attach one file. Combine multiple Gerbers into a ZIP archive.", 422, { attachment: "Only one attachment is accepted." });
    const file = files[0];
    if (file instanceof File && (file.size > 0 || file.name)) {
      if (result.data.kind !== "quote") return error("Attachments are accepted through the quote form.", 422);
      const metadataError = fileMetadataError(file);
      if (metadataError) return error(metadataError, 422, { attachment: metadataError });
      const buffer = Buffer.from(await file.arrayBuffer());
      const invalidContent = fileContentError(file, buffer);
      if (invalidContent) return error(invalidContent, 422, { attachment: invalidContent });
      const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
      attachment = { filename, content: buffer.toString("base64") };
    }
    if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) return error("Online delivery is unavailable. Your message has not been sent. Please email sales@protomlb.in or call +91 7620795067.", 503);
    const id = await sendSubmission(result.data, attachment);
    return NextResponse.json({ ok: true, id, message: "Your request has been accepted by our email service. Our team will reply using the email address you provided." }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return error("We couldn’t send your request. Please retry, or email sales@protomlb.in directly.", 503);
  }
}
