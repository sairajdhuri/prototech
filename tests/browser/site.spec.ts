import { test, expect } from "@playwright/test";
import sharp from "sharp";

async function imageDifference(first: Buffer, second: Buffer) {
  const metadata = await Promise.all([first, second].map(image => sharp(image).metadata()));
  // A translated canvas can straddle a CSS pixel boundary when captured.
  expect(Math.abs(metadata[0].width! - metadata[1].width!)).toBeLessThanOrEqual(1);
  expect(Math.abs(metadata[0].height! - metadata[1].height!)).toBeLessThanOrEqual(1);
  const width = Math.min(metadata[0].width!, metadata[1].width!);
  const height = Math.min(metadata[0].height!, metadata[1].height!);
  const [a, b] = await Promise.all([first, second].map(image => sharp(image).extract({ left: 0, top: 0, width, height }).removeAlpha().raw().toBuffer({ resolveWithObject: true })));
  let changed = 0;
  for (let i = 0; i < a.data.length; i += 3) {
    if ([0, 1, 2].some(channel => Math.abs(a.data[i + channel] - b.data[i + channel]) > 12)) changed++;
  }
  return changed / (a.info.width * a.info.height);
}

const routes = ["/", "/about", "/capabilities", "/machinery", "/products", "/customers", "/contact", "/quote", "/privacy", "/terms", "/credits"];
test("all pages resolve with headings, unique titles and canonical links", async ({ page }) => {
  const titles = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://protomlb.in${route === "/" ? "" : route}`);
    const title = await page.title(); expect(titles.has(title)).toBe(false); titles.add(title);
  }
});
for (const width of [360, 390, 768, 1440, 1920]) test(`layouts fit at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  for (const route of routes) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const longHeadings = await page.locator("h1, h2, h3").evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight) > 2.1).map(element => element.textContent));
    expect(longHeadings).toEqual([]);
  }
});
test("mobile navigation opens, traps focus and closes on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => document.querySelector("dialog[open]")?.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Capabilities", exact: true }).click();
  await expect(page).toHaveURL(/\/capabilities$/);
});
test("board selector updates URL and prefills the quote", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".webgl-ready")).toBeVisible({ timeout: 30000 });
  await page.getByRole("button", { name: "Multilayer", exact: true }).click();
  await expect(page).toHaveURL(/board=multilayer/);
  await page.getByRole("link", { name: "Quote this board" }).click();
  await expect(page.locator("#pcbType")).toHaveValue("multilayer");
  await expect(page.locator("#layers")).toHaveValue("4");
});
test("board selection updates locally and survives reload", async ({ page }) => {
  await page.goto("/capabilities?keep=1");
  const serverNavigations: string[] = [];
  page.on("request", request => {
    if (request.headers().rsc === "1" && !request.headers()["next-router-prefetch"] && request.url().includes("/capabilities?")) serverNavigations.push(request.url());
  });
  await page.getByRole("button", { name: "Multilayer", exact: true }).click();
  await expect(page.getByRole("button", { name: "Multilayer", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".explorer-image img")).toHaveAttribute("alt", "Multilayer PCB construction illustration");
  await expect(page).toHaveURL(/keep=1&board=multilayer/);
  expect(serverNavigations).toEqual([]);
  await page.reload();
  await expect(page.getByRole("button", { name: "Multilayer", exact: true })).toHaveAttribute("aria-pressed", "true");
});
test("gallery supports keyboard navigation and restores focus", async ({ page }) => {
  await page.goto("/products"); const trigger = page.locator(".gallery-item").first();
  const count = await page.locator(".gallery-item").count();
  await trigger.click(); await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight"); await expect(page.getByRole("dialog")).toContainText(`${count > 1 ? 2 : 1} of ${count}`);
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("form focuses invalid field and does not fake unconfigured delivery", async ({ page }) => {
  await page.route("**/api/submissions", route => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, message: "Online delivery is unavailable. Your message has not been sent. Please email sales@protomlb.in." }) }));
  await page.goto("/contact"); await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("#fullName")).toBeFocused();
  await page.getByLabel("Full name").fill("Sam Engineer"); await page.getByLabel("Email address").fill("sam@example.com");
  await page.getByLabel("Your message").fill("Please discuss our next PCB project.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Your message has not been sent");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeEnabled();
});
test("reduced motion leaves content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".webgl-ready")).toBeVisible({ timeout: 30000 });
  await page.addStyleTag({ content: ".pcb-canvas, .pcb-hero, .pcb-chapter { background: white; }" });
  const board = page.locator(".pcb-canvas canvas");
  const before = await board.screenshot();
  await page.locator(".pcb-chapter").scrollIntoViewIfNeeded();
  expect(await imageDifference(before, await board.screenshot())).toBeLessThan(0.005);
  await expect(page.getByRole("heading", { name: "More than just boards." })).toBeVisible();
});
test("PCB scroll animation changes, reverses and remounts without duplicate canvases", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto("/");
  await expect(page.locator(".webgl-ready")).toBeVisible({ timeout: 30000 });
  await page.addStyleTag({ content: ".pcb-canvas, .pcb-hero, .pcb-chapter { background: white; }" });
  const board = page.locator(".pcb-canvas canvas");
  const separated = await board.screenshot();
  const startPosition = await board.boundingBox();
  await expect(page.locator(".pcb-assembly-status")).toHaveText("Copper + FR4 · Layer stack");
  await page.locator(".pcb-chapter").evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 88, behavior: "instant" }));
  await page.waitForTimeout(1200);
  expect(await imageDifference(separated, await board.screenshot())).toBeGreaterThan(0.03);
  await expect(page.locator(".pcb-assembly-status")).toHaveText("One precisely bonded board");
  expect(Math.abs((await board.boundingBox())!.x - startPosition!.x)).toBeLessThan(1);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1200);
  expect(await imageDifference(separated, await board.screenshot())).toBeLessThan(0.005);
  await expect(page.locator(".pcb-assembly-status")).toHaveText("Copper + FR4 · Layer stack");
  await page.getByRole("link", { name: "Explore capabilities", exact: true }).click();
  await expect(page).toHaveURL(/\/capabilities$/);
  await page.goBack();
  await expect(page.locator(".webgl-ready")).toBeVisible({ timeout: 30000 });
  await expect(board).toHaveCount(1);
});
test("PCB fallback keeps the quote action usable without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof getContext>) {
      if (String(args[0]).startsWith("webgl")) return null;
      return getContext.apply(this, args);
    } as typeof getContext;
  });
  await page.goto("/");
  await expect(page.locator(".pcb-fallback")).toBeVisible();
  await page.locator(".pcb-hero").getByRole("link", { name: "Request a quote" }).click();
  await expect(page).toHaveURL(/\/quote$/);
});
test("reload shows the current PCB poster before the 3D code loads", async ({ page }) => {
  await page.route(/pcb-scene|pcb-mask-v3\.webp/, route => route.abort());
  await page.goto("/");
  const poster = page.locator(".pcb-fallback");
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("src", /pcb-stack-current\.[\w-]+\.webp/);
  await expect.poll(() => poster.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const source = await poster.getAttribute("src");
  await page.reload();
  await expect(poster).toBeVisible();
  await expect(poster).toHaveAttribute("src", source!);
  await expect(page.locator(".webgl-ready")).toHaveCount(0);
});
test("mobile PCB placement adapts when the hero copy grows", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 }); await page.goto("/");
  await expect(page.locator(".webgl-ready")).toBeVisible({ timeout: 30000 });
  await page.addStyleTag({ content: ".pcb-hero-copy p { font-size: 24px; }" });
  await expect.poll(async () => {
    const board = await page.locator(".pcb-canvas").boundingBox();
    const actions = await page.locator(".pcb-hero-bottom").boundingBox();
    return board!.y - actions!.y - actions!.height;
  }).toBeGreaterThanOrEqual(20);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
test("PCB mobile chapter keeps the travelling model above the copy and specifications", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/");
  await expect(page.locator(".webgl-ready")).toBeVisible({ timeout: 30000 });
  await page.locator(".pcb-scroll-hint").click();
  await page.waitForTimeout(1300);
  const copy = await page.locator(".pcb-chapter-copy").boundingBox();
  const board = await page.locator(".pcb-canvas").boundingBox();
  const specs = await page.locator(".pcb-chapter-specs").boundingBox();
  await expect(page.locator(".pcb-visual")).toHaveCSS("opacity", "1");
  expect(board!.y).toBeGreaterThanOrEqual(72);
  expect(board!.y + board!.height).toBeLessThanOrEqual(copy!.y);
  expect(board!.y + board!.height).toBeLessThanOrEqual(specs!.y);
});
test("gallery image URLs reopen the selected image", async ({ page }) => {
  await page.goto("/products");
  const count = await page.locator(".gallery-item").count();
  await page.locator(".gallery-item").first().click();
  await expect(page).toHaveURL(/image=/);
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText(`1 of ${count}`);
});
test("accepted enquiry clears the form and shows success", async ({ page }) => {
  await page.route("**/api/submissions", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: "mock-accepted-email", message: "Your request has been accepted by our email service." }) }));
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await page.getByLabel("Full name").fill("Sam Engineer");
  await page.getByLabel("Email address").fill("sam@example.com");
  await page.getByLabel("Your message").fill("Please discuss our next PCB project.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("accepted by our email service");
  await expect(page.locator("#fullName")).toHaveValue("");
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeEnabled();
});
test("quote validates dimensions and supports attachment removal", async ({ page }) => {
  await page.route("**/api/submissions", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: "mock-accepted-quote", message: "Your quote request has been accepted." }) }));
  await page.goto("/quote?pcbType=multilayer&layers=6");
  await page.getByRole("button", { name: "Send quote request" }).click();
  await page.getByLabel("Full name").fill("Sam Engineer");
  await page.getByLabel("Company name").fill("Board Works");
  await page.getByLabel("Email address").fill("sam@example.com");
  await page.getByLabel("Phone number").fill("+91 9999999999");
  await page.getByLabel("Board width (mm)").fill("461");
  await page.getByLabel("Board height (mm)").fill("80");
  await page.getByLabel("Quantity (boards)").fill("50");
  await page.getByLabel("Requirements", { exact: true }).fill("FR4, 1.6 mm, ENIG finish, green solder mask.");
  await page.getByRole("button", { name: "Send quote request" }).click();
  await expect(page.locator("#width-error")).toContainText("460 mm");
  await page.getByLabel("Board width (mm)").fill("100");
  await page.locator("#attachment").setInputFiles({ name: "empty.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(0) });
  await page.getByRole("button", { name: "Send quote request" }).click();
  await expect(page.locator("#attachment-error")).toContainText("attachment is empty");
  await page.locator("#attachment").setInputFiles({ name: "design.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7\nDesign requirements") });
  await page.getByRole("button", { name: "Remove attachment" }).click();
  expect(await page.locator("#attachment").evaluate((input: HTMLInputElement) => input.files?.length)).toBe(0);
  await page.getByRole("button", { name: "Send quote request" }).click();
  await expect(page.getByRole("status")).toContainText("Your quote request has been accepted");
});
test("legacy routes redirect and SEO outputs resolve", async ({ request }) => {
  for (const [source, destination] of [["/about-us", "/about"], ["/our-products", "/products"], ["/our-customers", "/customers"], ["/privacy-policy", "/privacy"], ["/terms-and-conditions", "/terms"]]) {
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toMatch(new RegExp(`${destination}$`));
  }
  const sitemap = await request.get("/sitemap.xml"); expect(sitemap.ok()).toBe(true); expect(await sitemap.text()).toContain("https://protomlb.in/quote");
  const robots = await request.get("/robots.txt"); expect(robots.ok()).toBe(true); expect(await robots.text()).toContain("Disallow: /api/");
  const image = await request.get("/opengraph-image"); expect(image.ok()).toBe(true); expect(image.headers()["content-type"]).toContain("image/png");
});
