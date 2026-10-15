import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("deployment lockfile has complete package records and Linux build dependencies", () => {
  const lock = JSON.parse(readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"));
  const entries = Object.entries(lock.packages) as [string, { version?: string; resolved?: string; integrity?: string; link?: boolean; os?: string[]; cpu?: string[] }][];
  for (const [path, entry] of entries) {
    if (!path || entry.link) continue;
    assert.ok(entry.version?.trim(), `${path}: missing package version`);
    assert.ok(entry.resolved?.startsWith("https://registry.npmjs.org/"), `${path}: nonportable package URL`);
    assert.ok(entry.integrity, `${path}: missing package checksum`);
  }
  for (const name of ["@next/swc-linux-x64-gnu", "@tailwindcss/oxide-linux-x64-gnu", "lightningcss-linux-x64-gnu", "@img/sharp-linux-x64", "@img/sharp-libvips-linux-x64", "@unrs/resolver-binding-linux-x64-gnu"]) {
    assert.ok(entries.some(([path, entry]) => path.endsWith(`node_modules/${name}`) && entry.os?.includes("linux") && entry.cpu?.includes("x64")), `${name}: Linux x64 package missing`);
  }
});
