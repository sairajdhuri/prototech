import test from "node:test";
import assert from "node:assert/strict";
import { quoteSchema, enquirySchema, fileMetadataError, fileContentError } from "../src/lib/validation";

const quote = { kind: "quote", fullName: "Sam Engineer", company: "Board Works", email: "sam@example.com", phone: "+91 9999999999", pcbType: "multilayer", layers: "6", width: "100.5", height: "80", quantity: "50", requirements: "FR4, 1.6 mm, ENIG finish, green solder mask.", website: "" };
test("quote validates numeric form fields and trims names", () => {
  const result = quoteSchema.parse({ ...quote, fullName: "  Sam Engineer  " });
  assert.equal(result.width, 100.5); assert.equal(result.quantity, 50); assert.equal(result.fullName, "Sam Engineer");
});
test("type/layer mismatch and oversized multilayer board reject", () => {
  assert.equal(quoteSchema.safeParse({ ...quote, pcbType: "double-sided", layers: "6" }).success, false);
  assert.equal(quoteSchema.safeParse({ ...quote, width: "461" }).success, false);
  assert.equal(quoteSchema.safeParse({ ...quote, quantity: "1.5" }).success, false);
  assert.equal(quoteSchema.safeParse({ ...quote, width: "" }).success, false);
});
test("enquiry permits optional company and phone, rejects honeypot", () => {
  const enquiry = { ...quote, kind: "enquiry", company: "", phone: "" };
  assert.equal(enquirySchema.safeParse(enquiry).success, true);
  assert.equal(enquirySchema.safeParse({ ...enquiry, website: "spam.example" }).success, false);
});
test("attachments are limited by size, extension and file signatures", () => {
  assert.ok(fileMetadataError({ name: "empty.pdf", size: 0 }));
  assert.ok(fileMetadataError({ name: "board.exe", size: 100 }));
  assert.ok(fileMetadataError({ name: "board.zip", size: 6 * 1024 * 1024 }));
  assert.ok(fileContentError({ name: "board.pdf" }, new TextEncoder().encode("not a PDF")));
  assert.equal(fileContentError({ name: "board.pdf" }, new TextEncoder().encode("%PDF-1.7")), undefined);
  assert.ok(fileContentError({ name: "board.zip" }, new TextEncoder().encode("not a ZIP")));
  assert.equal(fileContentError({ name: "board.gbr" }, new TextEncoder().encode("G04 test*\n%FSLAX24Y24*%")), undefined);
});
