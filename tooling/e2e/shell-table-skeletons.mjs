import assert from 'node:assert/strict';

const routes = ['/debts', '/overdue', '/reports/aging', '/users'];
const geometry = (table) => ({
  top: table.getBoundingClientRect().top,
  columns: [...table.querySelectorAll('th')].map((cell) => cell.getBoundingClientRect().width),
  rowHeight: table.querySelector('tbody tr').getBoundingClientRect().height,
  footer: table.parentElement.parentElement.lastElementChild.getBoundingClientRect().bottom,
});

/** Inspect streamed loading fallbacks without completing their React reveal scripts. */
export async function verifyShellTableSkeletons(
  page,
  { baseUrl = 'http://localhost:3000', width = 1440, height = 1000, screenshotPrefix } = {},
) {
  const browser = page.context().browser();
  const context = await browser.newContext({
    javaScriptEnabled: false,
    storageState: await page.context().storageState(),
    viewport: { width, height },
  });
  const loadingPage = await context.newPage();
  const readyPage = await page.context().newPage();
  await readyPage.setViewportSize({ width, height });
  const results = [];
  try {
    for (const route of routes) {
      await loadingPage.goto(new URL(route, baseUrl).href);
      const skeleton = await loadingPage
        .locator('[data-table-page-skeleton] table')
        .evaluate(geometry);
      await readyPage.goto(new URL(route, baseUrl).href);
      await readyPage.locator('[data-table-page-skeleton]').waitFor({ state: 'hidden' });
      await readyPage.locator('tbody tr').first().waitFor();
      const ready = await readyPage.locator('table').first().evaluate(geometry);
      assert.equal(skeleton.columns.length, ready.columns.length, `${route}: column count`);
      skeleton.columns.forEach((value, index) => {
        assert.ok(Math.abs(value - ready.columns[index]) <= 1, `${route}: column ${index} width`);
      });
      assert.ok(Math.abs(skeleton.top - ready.top) <= 1, `${route}: table position`);
      assert.equal(skeleton.rowHeight, 48, `${route}: shared compact skeleton density`);
      assert.ok(Math.abs(skeleton.footer - ready.footer) <= 1, `${route}: footer position`);
      if (screenshotPrefix) {
        const name = route.replaceAll('/', '-');
        await loadingPage.screenshot({ path: `${screenshotPrefix}${name}-loading.png` });
        await readyPage.screenshot({ path: `${screenshotPrefix}${name}-ready.png` });
      }
      results.push({ route, skeleton, ready });
    }
    return results;
  } finally {
    await context.close();
    await readyPage.close();
  }
}

/** Verify Angular retains its actual seven-column table while API data is pending. */
export async function verifyPaymentTableSkeleton(page, baseUrl = 'http://localhost:3000') {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const pattern = '**/api/payments?**';
  const hold = async (route) => {
    await gate;
    await route.continue();
  };
  await page.route(pattern, hold);
  try {
    await page.goto(new URL('/payments', baseUrl).href);
    await page.locator('.skeleton-row').first().waitFor();
    const loading = await page.locator('table').first().evaluate(geometry);
    release();
    await page.locator('.skeleton-row').first().waitFor({ state: 'hidden' });
    const ready = await page.locator('table').first().evaluate(geometry);
    assert.equal(loading.columns.length, 7);
    assert.equal(loading.rowHeight, 48);
    assert.equal(loading.top, ready.top);
    loading.columns.forEach((value, index) =>
      assert.ok(Math.abs(value - ready.columns[index]) <= 1),
    );
    return { loading, ready };
  } finally {
    release();
    await page.unroute(pattern, hold);
  }
}
