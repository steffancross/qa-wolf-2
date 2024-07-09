// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { loadNextPage, validateSequentialTime } = require("./helperFunctions");
const moment = require("moment");

// More understandable approach, get all articles first, then check if they are correctly ordered.
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
  validateSequentialTime(articlePostTimes)
    ? console.log("Articles were correctly ordered newest to oldest")
    : console.log("Articles were not ordered newest to oldest");
}

// Less straight forward but more time and space efficient approach.
// One pass through and no extra memory.
async function sortHackerNewsArticles2() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  let isValid = true;
  let previousTime = null;
  let articlesChecked = 0;
  let currentPageIndex = 0;

  while (articlesChecked < 100) {
    const currentAge = await page.locator(".age").nth(currentPageIndex);
    const currentTime = await currentAge.getAttribute("title");

    if (previousTime && moment(currentTime).isAfter(previousTime)) {
      isValid = false;
      break;
    }

    const lastTime = await page.locator(".age").last().getAttribute("title");
    if (currentTime === lastTime) {
      await loadNextPage(page);
      currentPageIndex = 0;
    }

    previousTime = currentTime;
    articlesChecked++;
    currentPageIndex++;
  }

  isValid
    ? console.log("Articles were correctly ordered newest to oldest")
    : console.log("Articles were not ordered newest to oldest");
}

(async () => {
  // await sortHackerNewsArticles();
  await sortHackerNewsArticles2();
})();
