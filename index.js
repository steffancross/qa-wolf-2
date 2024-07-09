// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  const articlePostTimes = [];
  const temporaryLocators = await page.locator(".age").all();

  for (const locator of temporaryLocators) {
    const timestamp = await locator.getAttribute("title");
    articlePostTimes.push(timestamp);
  }
  console.log(articlePostTimes.length);
}

(async () => {
  await sortHackerNewsArticles();
})();
