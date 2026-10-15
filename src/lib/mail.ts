import type { Submission } from "./validation";

export function submissionText(data: Submission) {
  const fields = [
    ["Name", data.fullName], ["Company", data.company || "Not provided"],
    ["Email", data.email], ["Phone", data.phone || "Not provided"],
  ];
  if (data.kind === "quote") fields.push(["PCB type", data.pcbType], ["Layers", String(data.layers)], ["Board dimensions", `${data.width} × ${data.height} mm`], ["Quantity", String(data.quantity)]);
  return fields.map(([name, value]) => `${name}: ${value}`).join("\n") + `\n\nRequirements:\n${data.requirements}`;
}

export async function sendSubmission(data: Submission, attachment?: { filename: string; content: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: [process.env.MAIL_TO || "sales@protomlb.in"],
      reply_to: data.email,
      subject: data.kind === "quote" ? "Prototech — PCB quotation request" : "Prototech — website enquiry",
      text: submissionText(data),
      ...(attachment ? { attachments: [attachment] } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Email service returned ${response.status}`);
  const result = await response.json();
  if (typeof result.id !== "string" || !result.id) throw new Error("Email service did not confirm acceptance");
  return result.id as string;
}
