// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { loadNextPage } = require("./helperFunctions");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  let articlePostTimes = [];
  while (articlePostTimes.length < 100) {
    const temporaryLocators = await page.locator(".age").all();

    for (const locator of temporaryLocators) {
      const timestamp = await locator.getAttribute("title");
      articlePostTimes.push(timestamp);
    }
    await loadNextPage(page);
  }
  articlePostTimes = articlePostTimes.slice(0, 100);
  console.log(articlePostTimes);
}

(async () => {
  await sortHackerNewsArticles();
})();
