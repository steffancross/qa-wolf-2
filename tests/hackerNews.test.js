import { test, expect } from "@playwright/test";

/*
  Was going crazy getting incosistent testing results.
  Turns out it was them being run in parallel and getting rate limited by hacker news.
  Set workers to 1 in the config and still had to manually wait in the last test.
  There probably is a better way, would love to know. 
*/

test.beforeEach(async ({ page }) => {
  await page.goto("https://news.ycombinator.com/newest");
});

test("Page has articles", async ({ page }) => {
  expect(await page.locator(".age").count()).toBeGreaterThan(0);
});

test("Page has more button", async ({ page }) => {
  expect(
    await page.getByRole("link", { name: "More", exact: true })
  ).not.toBeNull();
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
    await page.waitForTimeout(1500); //was being rate limited
  }

  expect(count).toBeGreaterThanOrEqual(100);
});
