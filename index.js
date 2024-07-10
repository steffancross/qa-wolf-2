// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const { loadNextPage, validateSequentialTime } = require("./helperFunctions");
const moment = require("moment");

// More understandable approach, get all articles first, then check if they are correctly ordered.
// Two passes, data collection and data validation. Storing all in an array.
async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    // collect all the articles
    let articlePostTimes = [];
    while (articlePostTimes.length < 100) {
      const temporaryLocators = await page.locator(".age").all();

      for (const locator of temporaryLocators) {
        const timestamp = await locator.getAttribute("title");
        articlePostTimes.push(timestamp);
      }
      await loadNextPage(page);
    }

    // process and validate their post times
    articlePostTimes = articlePostTimes.slice(0, 100);
    validateSequentialTime(articlePostTimes)
      ? console.log("Articles were correctly ordered newest to oldest")
      : console.log("Articles were not ordered newest to oldest");
  } catch (error) {
    console.error("error :(", error);
  } finally {
    await browser.close();
  }
}

// Less straight forward but more time and space efficient.
// One pass, no extra memory, and can early exit.
async function sortHackerNewsArticles2() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // go to Hacker News
    await page.goto("https://news.ycombinator.com/newest");

    let isOrdered = true;
    let prevArtcTime = null;
    let articlesChecked = 0;
    let currentPageIndex = 0;
    const nextPageIndex = (await page.locator(".age").count()) - 1;

    // compare and validate current article time against the previous one
    while (articlesChecked < 100) {
      const currentElement = await page.locator(".age").nth(currentPageIndex);
      const currentArtcTime = await currentElement.getAttribute("title");

      if (prevArtcTime && moment(currentArtcTime).isAfter(prevArtcTime)) {
        isOrdered = false;
        break;
      }

      if (currentPageIndex === nextPageIndex) {
        await loadNextPage(page);
        currentPageIndex = 0;
      }

      prevArtcTime = currentArtcTime;
      articlesChecked++;
      currentPageIndex++;
    }

    isOrdered
      ? console.log("Articles were correctly ordered newest to oldest")
      : console.log("Articles were not ordered newest to oldest");
  } catch (error) {
    console.error("error :(", error);
  } finally {
    await browser.close();
  }
}

(async () => {
  await sortHackerNewsArticles();
  // await sortHackerNewsArticles2();
})();
