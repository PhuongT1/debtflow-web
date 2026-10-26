import assert from 'node:assert/strict';

/** Read-only integration checks against the authenticated, Vietnamese development stack. */
export async function verifySharedTables(
  page,
  { shellUrl = 'http://localhost:3000', partnerUrl = 'http://localhost:3001' } = {},
) {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  const viewport = page.viewportSize();
  page.on('pageerror', onError);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    // These render callbacks on the server, including data with non-plain money values.
    for (const path of ['/overdue', '/reports/aging', '/users']) {
      await page.goto(new URL(path, shellUrl).href);
      await page.locator('table').waitFor();
      assert.equal(await page.getByText('An Error Occurred While Loading Data').count(), 0);
    }
    await page.goto(new URL('/debts', shellUrl).href);
    await page.locator('table tbody tr').nth(1).waitFor();
    await page.getByRole('button', { name: 'Go to page 2', exact: true }).click();
    await page.waitForURL(/page=2/);
    await page.getByText(/Hiển thị 21-/).waitFor();
    await page.getByRole('button', { name: 'Đối tác', exact: true }).first().click();
    await page.waitForURL(/sortOrder=desc/);
    assert.equal(new URL(page.url()).searchParams.get('page'), '1');

    // Same renderer with different app navigation adapters.
    for (const embedded of [false, true]) {
      await page.goto(new URL('/parties', embedded ? shellUrl : partnerUrl).href);
      const scope = embedded ? page.frameLocator('iframe[title="partner-ops"]') : page;
      await scope.locator('table tbody tr').nth(1).waitFor();
      await scope.getByRole('button', { name: 'Go to page 2', exact: true }).click();
      await page.waitForURL(/page=2/);
      await scope.getByText(/Hiển thị 21-/).waitFor();
      await scope.getByRole('combobox').last().click();
      await scope.getByRole('option', { name: '10', exact: true }).click();
      await page.waitForURL(/pageSize=10/);
      await scope.getByText(/Hiển thị 1-10/).waitFor();
      assert.equal(await scope.locator('table tbody tr').count(), 10);
    }

    await page.goto(new URL('/parties', partnerUrl).href);
    await page.locator('table tbody tr').nth(1).waitFor();
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const pattern = '**/api/parties?**';
    const hold = async (route) => {
      await gate;
      await route.continue();
    };
    await page.route(pattern, hold);
    try {
      await page.getByRole('textbox').fill('__shared_table_no_match__');
      await page.getByRole('button', { name: 'Lọc', exact: true }).click();
      await page.locator('tbody .MuiSkeleton-root').first().waitFor();
      assert.equal(
        await page.locator('tbody tr[aria-hidden="true"]').count(),
        8,
        'Partner table uses the shared skeleton default',
      );
      release();
      await page.getByText('Không có khách hàng / nhà cung cấp', { exact: true }).waitFor();
      await page.getByText('Hiển thị 0-0 / 0 dòng', { exact: true }).waitFor();
    } finally {
      release();
      await page.unroute(pattern, hold);
    }
    await page.getByRole('button', { name: 'Xóa lọc', exact: true }).click();
    await page.locator('table tbody tr').nth(1).waitFor();

    await page.setViewportSize({ width: 390, height: 844 });
    const bounds = await page.locator('table').evaluate((table) => {
      const row = table.querySelector('tbody tr');
      return {
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        nameRight: row.cells[0].getBoundingClientRect().right,
        actionsLeft: row.cells[row.cells.length - 1].getBoundingClientRect().left,
      };
    });
    assert.equal(bounds.pageOverflow, false);
    assert.ok(bounds.actionsLeft >= bounds.nameRight, 'Fixed columns must not overlap on phones');
    await page.locator('table').evaluate((table) => {
      table.parentElement.scrollLeft = table.parentElement.scrollWidth;
    });
    await page
      .getByRole('button', { name: 'Xem thanh toán', exact: true })
      .first()
      .click({ trial: true });
    assert.deepEqual(errors, []);
    return {
      serverRendering: true,
      sorting: true,
      standalone: true,
      embedded: true,
      pagination: true,
      pageSize: true,
      loading: true,
      emptyAndClear: true,
      mobile: true,
    };
  } finally {
    page.off('pageerror', onError);
    if (viewport) await page.setViewportSize(viewport);
  }
}
