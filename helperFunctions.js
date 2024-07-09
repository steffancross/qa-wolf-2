async function loadNextPage(page) {
  await page.getByRole("link", { name: "More", exact: true }).click();
}

module.exports = {
  loadNextPage,
};
