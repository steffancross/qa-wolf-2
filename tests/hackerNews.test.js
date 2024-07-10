import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://news.ycombinator.com/newest");
});

test("Page has articles", async ({ page }) => {
  const articleCount = await page.locator(".age").count();
  expect(articleCount).toBeGreaterThan(0);
});

test("Page has more button", async ({ page }) => {
  const moreButton = await page.getByRole("link", {
    name: "More",
    exact: true,
  });
  expect(moreButton).not.toBeNull();
});

test("There are enough articles", async ({ page }) => {
  let count = 0;

  while (count <= 100) {
    const pageArticles = await page.locator(".age").count();
    count += pageArticles;

    await page
      .getByRole("link", {
        name: "More",
        exact: true,
      })
      .click();
    await page.waitForTimeout(2000); //was being rate limited
  }

  expect(count).toBeGreaterThanOrEqual(100);
});

// fix rate limiting
