import assert from 'node:assert/strict';

/** Compare the initial Shell skeleton and the real embedded page at the same viewport. */
export async function verifyPartySkeletonLayout(
  page,
  { width, height = 1000, screenshotPrefix, baseUrl = 'http://localhost:3000' },
) {
  await page.setViewportSize({ width, height });
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const pending = [];
  const pattern = '**/__mfe/partner-ops/**';
  const hold = (route) => {
    const task = (async () => {
      if (route.request().resourceType() === 'document') await gate;
      await route.continue();
    })();
    pending.push(task);
    return task;
  };
  await page.route(pattern, hold);
  let skeleton;
  const close = (a, b, message, tolerance = 1) =>
    assert.ok(Math.abs(a - b) <= tolerance, `${message}: ${a} vs ${b}`);
  try {
    await page.goto(new URL('/parties', baseUrl).href, { waitUntil: 'commit' });
    const root = page.locator('[data-remote-loading]');
    await root.locator('[data-layout-ready="true"]').waitFor();
    const bounds = async (selector) => {
      const box = await root.locator(selector).first().boundingBox();
      assert.ok(box, selector);
      return box;
    };
    skeleton = {
      header: await bounds('[data-skeleton-header]'),
      toolbar: await bounds('[data-skeleton-toolbar]'),
      table: await bounds('[data-skeleton-table]'),
      row: await bounds('tbody tr'),
      footer: await root.locator('[data-skeleton-pagination]').evaluate((e) => {
        const r = e.parentElement.getBoundingClientRect();
        return { y: r.y, height: r.height };
      }),
      headerCells: await root
        .locator('th')
        .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().width)),
    };
    assert.equal((await root.locator('tbody tr').count()) > 0, true);
    if (screenshotPrefix) await page.screenshot({ path: `${screenshotPrefix}-skeleton.png` });
    release();
    await Promise.all(pending);
    await root.waitFor({ state: 'hidden' });
    const frame = page.frameLocator('iframe[title="partner-ops"]');
    await frame
      .getByRole('button', { name: /^(Delete|Xóa)$/ })
      .first()
      .waitFor();
    const header = await frame.locator('main header').boundingBox();
    const toolbar = await frame.locator('form').first().boundingBox();
    const row = await frame.locator('tbody tr').first().boundingBox();
    const cells = await frame
      .locator('th')
      .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().width));
    assert.ok(header && toolbar && row);
    const iframe = await page.locator('iframe[title="partner-ops"]').boundingBox();
    assert.ok(iframe);
    const footer = await frame
      .locator('p')
      .filter({ hasText: /Showing \d|Hiển thị \d/ })
      .evaluate((e) => {
        const r = e.parentElement.parentElement.getBoundingClientRect();
        return { y: r.y, height: r.height };
      });
    footer.y += iframe.y;
    const footerVisible = footer.y < iframe.y + iframe.height;
    assert.equal(
      skeleton.footer.y < iframe.y + iframe.height,
      footerVisible,
      'footer viewport placement',
    );
    if (footerVisible) {
      close(skeleton.footer.y, footer.y, 'footer.y');
      close(skeleton.footer.height, footer.height, 'footer.height');
    }

    for (const key of ['x', 'y', 'width', 'height'])
      close(skeleton.header[key], header[key], `header.${key}`);
    for (const key of ['x', 'y', 'width', 'height'])
      close(skeleton.toolbar[key], toolbar[key], `toolbar.${key}`);
    close(skeleton.row.y, row.y, 'first row y');
    close(skeleton.row.height, row.height, 'row height');
    assert.equal(skeleton.headerCells.length, cells.length);
    cells.forEach((cell, i) => close(skeleton.headerCells[i], cell, `column ${i}`));
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
      false,
    );
    if (screenshotPrefix) await page.screenshot({ path: `${screenshotPrefix}-loaded.png` });
    return {
      width,
      height,
      header,
      toolbar,
      rowHeight: row.height,
      columns: cells.length,
      geometryTolerance: 1,
      footerVisible,
    };
  } finally {
    release();
    await Promise.allSettled(pending);
    await page.unroute(pattern, hold);
  }
}
