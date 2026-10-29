import assert from 'node:assert/strict';

/** Run with an authenticated Playwright Page against the real development stack. */
export async function verifyPartnerEmbedding(page, baseUrl = 'http://localhost:3000') {
  const failures = [];
  const documents = [];
  const onError = (error) => failures.push(error.message);
  const onResponse = (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  };
  const onRequest = (request) => {
    if (request.isNavigationRequest()) documents.push(request.url());
  };
  await page.goto(new URL('/parties?pageSize=10', baseUrl).href);
  const frame = page.frameLocator('iframe[title="partner-ops"]');
  await frame.getByRole('button', { name: 'Go to page 2', exact: true }).waitFor();
  const initial = await frame.locator('body').evaluate(() => {
    window.__embeddingTest = crypto.randomUUID();
    return { marker: window.__embeddingTest, timeOrigin: performance.timeOrigin };
  });
  await page.evaluate(() => {
    window.__hostLoadingSeen = false;
    window.__hostLoadingObserver = new MutationObserver(() => {
      if (document.querySelector('[data-remote-loading]') !== null) window.__hostLoadingSeen = true;
    });
    window.__hostLoadingObserver.observe(document.body, { childList: true, subtree: true });
  });
  page.on('pageerror', onError);
  page.on('response', onResponse);
  page.on('request', onRequest);
  const summary = () => frame.locator('p').filter({ hasText: /Showing \d|Hiển thị \d/ });
  try {
    const firstSummary = await summary().textContent();
    await frame.getByRole('button', { name: 'Go to page 2', exact: true }).click();
    await page.waitForURL('**/parties?pageSize=10&page=2');
    await summary()
      .filter({ hasText: /(?:Showing|Hiển thị) 11-/ })
      .waitFor();
    await page.goBack({ waitUntil: 'commit' });
    await page.waitForURL('**/parties?pageSize=10');
    await summary().filter({ hasText: firstSummary }).waitFor();
    await page.goForward({ waitUntil: 'commit' });
    await page.waitForURL('**/parties?pageSize=10&page=2');
    await summary()
      .filter({ hasText: /(?:Showing|Hiển thị) 11-/ })
      .waitFor();
    await frame.getByRole('button', { name: 'Go to page 1', exact: true }).click();
    await page.waitForURL('**/parties?pageSize=10');
    await summary().filter({ hasText: firstSummary }).waitFor();
    const partner = frame.locator('tbody a').first();
    const name = await partner.textContent();
    await partner.click();
    await frame.getByRole('heading', { name, exact: true }).waitFor();
    await page.goBack({ waitUntil: 'commit' });
    await page.waitForURL('**/parties?pageSize=10');
    await summary().filter({ hasText: firstSummary }).waitFor();
    await frame.getByRole('combobox').last().click();
    await frame.getByRole('option', { name: '20', exact: true }).click();
    await page.waitForURL('**/parties?pageSize=20');
    await summary()
      .filter({ hasText: /(?:Showing|Hiển thị) 1-20/ })
      .waitFor();
    const url = page.url();
    await page.evaluate(() =>
      window.postMessage(
        {
          source: 'partner-ops',
          version: 1,
          type: 'debtflow:navigate',
          path: '/debts',
        },
        location.origin,
      ),
    );
    await frame.locator('body').evaluate(() =>
      window.parent.postMessage(
        {
          source: 'partner-ops',
          version: 999,
          type: 'debtflow:navigate',
          path: '/debts',
        },
        location.origin,
      ),
    );
    await page.evaluate(() => new Promise(requestAnimationFrame));
    assert.equal(page.url(), url, 'Forged or wrong-version navigation must be ignored');
    const final = await frame.locator('body').evaluate(() => ({
      marker: window.__embeddingTest,
      timeOrigin: performance.timeOrigin,
    }));
    assert.deepEqual(final, initial, 'Keep the same iframe document and runtime');
    assert.deepEqual(documents, [], 'Internal navigation must not load a new document');
    assert.deepEqual(failures, [], 'No browser errors or HTTP failures');
    assert.equal(
      await page.evaluate(() => window.__hostLoadingSeen),
      false,
      'Host loading must not appear during internal navigation',
    );
    return {
      pagination: true,
      backForward: true,
      detail: true,
      pageSize: true,
      sameDocument: true,
      hostLoading: false,
      failures,
      documents,
    };
  } finally {
    page.off('pageerror', onError);
    page.off('response', onResponse);
    page.off('request', onRequest);
    await page.evaluate(() => window.__hostLoadingObserver?.disconnect());
  }
}

/** Hold only the embedded document to inspect the Shell's first-load placeholder. */
export async function verifyInitialEmbeddedLoading(page, baseUrl = 'http://localhost:3000') {
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
  try {
    await page.goto(new URL('/parties?pageSize=10', baseUrl).href, { waitUntil: 'commit' });
    const loading = page.locator('[data-remote-loading]');
    await loading.waitFor();
    assert.equal(await loading.getAttribute('aria-busy'), 'true');
    const label = await loading.getAttribute('aria-label');
    assert.ok(['Loading page', 'Đang tải trang'].includes(label), 'Loading status is localized');
    assert.ok(
      (await loading.locator('.MuiSkeleton-root').count()) > 0,
      'Initial load uses a page skeleton',
    );
    assert.equal(await loading.locator('.MuiCircularProgress-root').count(), 0);
    assert.equal(/micro\s*frontend/i.test(await page.locator('body').innerText()), false);
    release();
    await Promise.all(pending);
    const frame = page.frameLocator('iframe[title="partner-ops"]');
    await frame
      .getByRole('heading', { name: /Customers \/ Suppliers|Khách hàng \/ Nhà cung cấp/ })
      .waitFor();
    await loading.waitFor({ state: 'hidden' });
    return {
      initialSkeleton: true,
      localizedLabel: label,
      technicalText: false,
      readyHandoff: true,
    };
  } finally {
    release();
    await Promise.allSettled(pending);
    await page.unroute(pattern, hold);
  }
}

/** A retry replaces the iframe Window: navigation and overlay clients must rebind. */
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
