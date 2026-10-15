import { z } from "zod";

const common = {
  fullName: z.string().trim().min(2, "Enter your full name.").max(100, "Use 100 characters or fewer."),
  company: z.string().trim().max(160, "Use 160 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  phone: z.string().trim().max(30).refine(value => !value || /^[+\d\s().-]{7,30}$/.test(value) && (value.match(/\d/g)?.length || 0) >= 7, "Enter a phone number with at least 7 digits."),
  requirements: z.string().trim().min(10, "Tell us a little more; use at least 10 characters.").max(5000, "Use 5,000 characters or fewer."),
  website: z.string().max(0, "Please leave the website field empty.").optional().default(""),
};
export const enquirySchema = z.object({ kind: z.literal("enquiry"), ...common });
export const quoteSchema = z.object({
  kind: z.literal("quote"), ...common,
  company: z.string().trim().min(2, "Enter your company name.").max(160),
  phone: common.phone.refine(value => value.length > 0, "Enter your phone number."),
  pcbType: z.enum(["single-sided", "double-sided", "multilayer"], { error: "Select a PCB type." }),
  layers: z.coerce.number().int().min(1).max(12),
  width: z.coerce.number().positive("Enter the board width in mm.").max(2000, "Confirm dimensions with the team for boards over 2,000 mm."),
  height: z.coerce.number().positive("Enter the board height in mm.").max(2000, "Confirm dimensions with the team for boards over 2,000 mm."),
  quantity: z.coerce.number().int("Enter a whole number.").min(1, "Enter at least 1 board.").max(1000000),
}).superRefine((data, context) => {
  const allowed = data.pcbType === "single-sided" ? [1] : data.pcbType === "double-sided" ? [2] : [4, 6, 8, 10, 12];
  if (!allowed.includes(data.layers)) context.addIssue({ code: "custom", path: ["layers"], message: "Choose a layer count that matches the PCB type." });
  if (data.pcbType === "multilayer") {
    if (data.width > 460) context.addIssue({ code: "custom", path: ["width"], message: "Published multilayer width is up to 460 mm. Contact us for other sizes." });
    if (data.height > 460) context.addIssue({ code: "custom", path: ["height"], message: "Published multilayer height is up to 460 mm. Contact us for other sizes." });
  }
});
export const submissionSchema = z.union([enquirySchema, quoteSchema]);
export type Submission = z.infer<typeof submissionSchema>;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const allowedExtensions = ["zip", "pdf", "gbr", "ger", "gtl", "gbl", "gts", "gbs", "gto", "gbo", "drl"];
export function fileMetadataError(file: { name: string; size: number }): string | undefined {
  if (file.size === 0) return "The attachment is empty. Export and attach it again.";
  if (file.size > MAX_FILE_BYTES) return "Attach a file smaller than 5 MB.";
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  if (!allowedExtensions.includes(extension)) return "Use a ZIP, PDF, Gerber or drill file.";
}
export function fileContentError(file: { name: string }, bytes: Uint8Array): string | undefined {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const start = new TextDecoder().decode(bytes.slice(0, 8192));
  if (extension === "zip" && !(bytes[0] === 0x50 && bytes[1] === 0x4b && [[3, 4], [5, 6], [7, 8]].some(([a, b]) => bytes[2] === a && bytes[3] === b))) return "The ZIP file appears invalid. Export and attach it again.";
  if (extension === "pdf" && !start.startsWith("%PDF-")) return "The PDF appears invalid. Export and attach it again.";
  if (extension !== "zip" && extension !== "pdf" && (!/G04|%FS|%MO|M48|%TF|G0?[123]/.test(start) || start.includes("\0"))) return "The Gerber or drill file appears invalid. Use an exported board file or ZIP archive.";
}
