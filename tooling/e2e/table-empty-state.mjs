import assert from 'node:assert/strict';

/** Read-only checks: filtered-empty tables stay centered in their visible scrollport. */
export async function verifyTableEmptyState(
  page,
  { shellUrl = 'http://localhost:3000', partnerUrl = 'http://localhost:3001' } = {},
) {
  const viewport = page.viewportSize();
  const results = [];
  const cases = [
    {
      name: 'embedded',
      url: shellUrl + '/parties?q=__empty_layout_test__',
      embedded: true,
      width: 1366,
    },
    { name: 'standalone', url: partnerUrl + '/parties?q=__empty_layout_test__', width: 1366 },
    {
      name: 'summary-fixed-layout',
      url: shellUrl + '/debts?partnerQ=__empty_layout_test__',
      width: 1366,
    },
    {
      name: 'shell-server-rendered',
      url: shellUrl + '/overdue?q=__empty_layout_test__',
      width: 1366,
    },
    {
      name: 'embedded-mobile',
      url: shellUrl + '/parties?q=__empty_layout_test__',
      embedded: true,
      width: 390,
    },
    { name: 'standalone-mobile', url: partnerUrl + '/parties?q=__empty_layout_test__', width: 390 },
  ];
  const close = (a, b, message) => assert.ok(Math.abs(a - b) <= 1, `${message}: ${a} vs ${b}`);
  try {
    for (const item of cases) {
      await page.setViewportSize({ width: item.width, height: 1000 });
      await page.goto(item.url);
      const scope = item.embedded ? page.frameLocator('iframe[title="partner-ops"]') : page;
      const state = scope.locator('[data-table-state]').filter({
        hasText:
          /No customers or suppliers|Không có khách hàng|No partners with outstanding debt|Không có đối tác còn công nợ|Không có nợ quá hạn/,
      });
      await state.waitFor();
      assert.equal(
        await state.locator('svg[aria-hidden="true"]').count(),
        1,
        'Empty icon is decorative',
      );
      const table = state.locator('xpath=ancestor::table');
      for (const fraction of [0, 0.5, 1]) {
        await table.evaluate((table, fraction) => {
          const container = table.parentElement;
          container.scrollLeft = (container.scrollWidth - container.clientWidth) * fraction;
        }, fraction);
        await page.evaluate(() => new Promise(requestAnimationFrame));
        const bounds = await table.evaluate((table) => {
          const container = table.parentElement;
          const v = container.getBoundingClientRect();
          const header = table.querySelector('thead').getBoundingClientRect();
          const state = table.querySelector('[data-table-state]').getBoundingClientRect();
          return {
            expectedX: v.left + container.clientWidth / 2,
            expectedY: (header.bottom + v.top + container.clientHeight) / 2,
            x: state.x + state.width / 2,
            y: state.y + state.height / 2,
          };
        });
        close(bounds.x, bounds.expectedX, `${item.name}: horizontal center at scroll ${fraction}`);
        close(bounds.y, bounds.expectedY, `${item.name}: vertical center`);
      }
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
      );
      results.push(item.name);
    }
    await page.setViewportSize({ width: 1366, height: 1000 });
    await page.goto(shellUrl + '/parties');
    const frame = page.frameLocator('iframe[title="partner-ops"]');
    await frame
      .getByRole('button', { name: /^(Delete|Xóa)$/ })
      .first()
      .waitFor();
    assert.equal(await frame.locator('[data-table-state]').count(), 0);
    const fixed = await frame.locator('table').evaluate((table) => ({
      first: getComputedStyle(table.querySelector('thead th:first-child')).left,
      last: getComputedStyle(table.querySelector('thead th:last-child')).right,
    }));
    assert.equal(fixed.first, '0px');
    assert.equal(fixed.last, '0px');
    return { centeredCases: results, scrollPositionsPerCase: 3, dataAndFixedColumnsRestored: true };
  } finally {
    if (viewport) await page.setViewportSize(viewport);
  }
}
