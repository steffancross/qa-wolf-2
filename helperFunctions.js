const moment = require("moment");

async function loadNextPage(page) {
  await page.getByRole("link", { name: "More", exact: true }).click();
}

function validateSequentialTime(array) {
  for (let i = 0; i <= array.length; i++) {
    if (moment(array[i]).isBefore(moment(array[i + 1]))) {
      return false;
    }
  }
  return true;
}

module.exports = {
  loadNextPage,
  validateSequentialTime,
};
