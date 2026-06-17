import { expect, test } from "@playwright/test";

test.describe("public entry points", () => {
  test("renders the login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Pixelar" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Design, animate,/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign in with Google/i })).toBeVisible();
  });

  test("renders the GIF converter upload state", async ({ page }) => {
    await page.goto("/tools/gif-converter");

    await expect(page.getByRole("heading", { name: "Sprite Sheet to GIF" })).toBeVisible();
    await expect(page.getByText("Click to upload or drag and drop")).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Home/i })).toHaveAttribute("href", "/home");
  });
});

test.describe("protected route behavior", () => {
  for (const route of ["/", "/home", "/projects", "/sprites", "/scenes"]) {
    test(`redirects unauthenticated users from ${route} to login`, async ({ page }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/login$/);
      await expect(page.getByRole("button", { name: /Sign in with Google/i })).toBeVisible();
    });
  }
});
