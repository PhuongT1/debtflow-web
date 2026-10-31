import assert from 'node:assert/strict';

export async function verifyPartnerRetry({ page, baseUrl = 'http://localhost:3000' }) {
  let failed = false;
  const pattern = '**/__embed/parties*';
  const failFirstDocument = (route) => {
    if (!failed && route.request().isNavigationRequest()) {
      failed = true;
      return route.abort();
    }
    return route.continue();
  };
  await page.route(pattern, failFirstDocument);
  try {
    await page.goto(new URL('/parties', baseUrl).href);
    await page.getByRole('button', { name: 'Thử lại', exact: true }).click();
    const caller = page.frameLocator('iframe[title="partner-ops"]');
    await caller.getByRole('button', { name: 'Add partner', exact: true }).click();
    const content = page.frameLocator('iframe[data-overlay-session]');
    await content.getByRole('textbox', { name: /^Name/ }).waitFor();
    await content.getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    return { retryCreatedNewRuntime: true, overlayRebound: true };
  } finally {
    await page.unroute(pattern, failFirstDocument);
  }
}

/** Drop the first ready notification to verify recovery without replacing the iframe. */
export async function verifyPartnerReadyRecovery(page, baseUrl = 'http://localhost:3000') {
  const probe = await page.context().newPage();
  try {
    await probe.addInitScript(() => {
      if (window !== window.top) return;
      window.__droppedPartnerReady = false;
      const add = window.addEventListener.bind(window);
      const remove = window.removeEventListener.bind(window);
      const wrappers = new WeakMap();
      window.addEventListener = (type, listener, options) => {
        if (type !== 'message' || typeof listener !== 'function')
          return add(type, listener, options);
        const wrapped = (event) => {
          if (
            event.data?.type === 'debtflow:ready' &&
            event.data.source === 'partner-ops' &&
            !window.__droppedPartnerReady
          ) {
            window.__droppedPartnerReady = true;
            return;
          }
          listener(event);
        };
        wrappers.set(listener, wrapped);
        return add(type, wrapped, options);
      };
      window.removeEventListener = (type, listener, options) =>
        remove(type, wrappers.get(listener) || listener, options);
    });
    await probe.goto(new URL('/parties', baseUrl).href);
    await probe.locator('iframe[title="partner-ops"]').waitFor({ state: 'visible' });
    await probe.frameLocator('iframe[title="partner-ops"]').getByRole('heading').first().waitFor();
    assert.equal(await probe.evaluate(() => window.__droppedPartnerReady), true);
    assert.equal(
      await probe.getByText('Micro frontend did not report ready state in time.').count(),
      0,
    );
    return { recoveredMissingReady: true };
  } finally {
    await probe.close();
  }
}

/** Verify bounded table scrolling and network revalidation for previously cached pages. */
export async function verifyPartnerTableNavigation(page, baseUrl = 'http://localhost:3000') {
  const viewport = page.viewportSize();
  try {
    await page.setViewportSize({ width: 1100, height: 780 });
    await page.goto(new URL('/parties?pageSize=10', baseUrl).href);
    const frame = page.frameLocator('iframe[title="partner-ops"]');
    await frame.getByText(/(?:Showing|Hiển thị) 1-10/).waitFor();
    const layout = await frame.locator('table').evaluate((table) => {
      const body = table.parentElement;
      const footer = body.parentElement.lastElementChild;
      body.scrollTop = 120;
      body.scrollLeft = 120;
      return {
        footerBottom: footer.getBoundingClientRect().bottom,
        viewportHeight: window.innerHeight,
        vertical: body.scrollTop,
        horizontal: body.scrollLeft,
      };
    });
    assert.ok(
      layout.footerBottom <= layout.viewportHeight,
      'Footer must remain inside the viewport',
    );
    assert.ok(layout.vertical > 0, 'Rows must scroll vertically');
    assert.ok(layout.horizontal > 0, 'Columns must scroll horizontally');
    for (const target of [2, 1, 2]) {
      const response = page.waitForResponse((value) => {
        const url = new URL(value.url());
        return (
          url.pathname.endsWith('/api/parties') && url.searchParams.get('page') === String(target)
        );
      });
      await frame.getByRole('button', { name: `Go to page ${target}`, exact: true }).click();
      assert.equal(
        (await response).status(),
        200,
        `Page ${target} must revalidate even when cached`,
      );
    }
    return { boundedScrolling: true, cachedPagesRevalidated: true };
  } finally {
    if (viewport) await page.setViewportSize(viewport);
  }
}
