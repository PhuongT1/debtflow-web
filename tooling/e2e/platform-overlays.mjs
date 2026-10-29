/** Requires an authenticated English demo session. All writes are intercepted. */
export async function verifyPlatformOverlays(
  page,
  { baseUrl = 'http://localhost:3000', embedded = true, width = 1440 } = {},
) {
  const check = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on('pageerror', onError);
  let writeCount = 0;
  let readsAfterWrite = 0;
  let failWrite = true;
  const intercept = async (route) => {
    const request = route.request();
    if (!['POST', 'PATCH', 'DELETE'].includes(request.method())) {
      if (writeCount) readsAfterWrite++;
      return route.continue();
    }
    writeCount++;
    if (failWrite)
      return route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Service unavailable' }),
      });
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { id: 'overlay-test', ...request.postDataJSON() } }),
    });
  };
  await page.route('**/api/parties**', intercept);
  try {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${baseUrl}/parties`);
    const app = embedded ? page.frameLocator('iframe[title="partner-ops"]') : page;
    if (embedded)
      await app.locator('body').evaluate(() => {
        window.__overlayResultListener = (event) => {
          if (
            event.source === window.parent &&
            event.data?.protocol === 'platform-overlay-v1' &&
            event.data?.type === 'result' &&
            event.data.result?.status === 'completed'
          )
            window.__overlayReturned = event.data.result;
        };
        window.addEventListener('message', window.__overlayResultListener);
      });
    const trigger = app.getByRole('button', { name: 'Add partner', exact: true });
    await trigger.click();
    const body = embedded ? page.frameLocator('[role="dialog"] iframe') : page;
    const name = body.getByRole('textbox', { name: /^Name/ });
    await name.fill('Overlay test draft');
    const modal = page.getByRole('dialog').first();
    const bounds = await modal.boundingBox();
    check(
      Math.abs(bounds.x + bounds.width / 2 - width / 2) < 2,
      'Modal is not centered on the full viewport',
    );
    if (embedded) {
      const backdrop = await page.locator('.MuiBackdrop-root').boundingBox();
      check(
        backdrop.x === 0 && backdrop.y === 0 && backdrop.width === width,
        'Backdrop does not cover Shell',
      );
      const menu = body.getByRole('combobox').first();
      await menu.click();
      await body.getByRole('option', { name: 'Customer', exact: true }).click();
    }
    await body.getByRole('button', { name: 'Close', exact: true }).click();
    await body.getByRole('button', { name: 'Keep editing', exact: true }).click();
    check((await name.inputValue()) === 'Overlay test draft', 'Closing guard lost the draft');
    await body.getByRole('button', { name: 'Create partner', exact: true }).click();
    await body.locator('.MuiAlert-standard').first().waitFor();
    check((await name.inputValue()) === 'Overlay test draft', 'Failed save lost the draft');
    failWrite = false;
    await body.getByRole('button', { name: 'Create partner', exact: true }).click();
    await modal.waitFor({ state: 'hidden' });
    check(writeCount === 2, 'Save retry sent duplicate requests');
    await page.waitForTimeout(250);
    if (embedded)
      check(
        await app
          .locator('body')
          .evaluate(() => window.__overlayReturned?.data?.id === 'overlay-test'),
        'Completed result data did not reach the caller',
      );
    check(readsAfterWrite > 0, 'Completion did not refresh the initiating list');
    check(
      await trigger.evaluate((node) => node === document.activeElement),
      'Focus did not return to the opening button',
    );
    await app.getByRole('button', { name: 'Help', exact: true }).click();
    await body.getByRole('button', { name: 'Close help', exact: true }).waitFor();
    await page.screenshot({
      path: `/tmp/overlay-${embedded ? 'embedded' : 'standalone'}-${width}.png`,
    });
    await body.getByRole('button', { name: 'Close help', exact: true }).press('Escape');
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    await app.getByRole('button', { name: 'Delete', exact: true }).first().click();
    await body.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    check(writeCount === 2, 'Cancel unexpectedly performed a mutation');
    if (embedded)
      await app.locator('body').evaluate(() => {
        window.removeEventListener('message', window.__overlayResultListener);
        delete window.__overlayResultListener;
        delete window.__overlayReturned;
      });
    check(!errors.length, errors.join('; '));
    return {
      embedded,
      width,
      writesIntercepted: writeCount,
      draftGuard: true,
      apiRetry: true,
      focusRestored: true,
      viewportBackdrop: true,
      helpEscape: true,
      deleteCancel: true,
    };
  } finally {
    await page.unroute('**/api/parties**', intercept);
    page.off('pageerror', onError);
  }
}

/** Holds mocked mutations to verify close guards, then simulates success. */
export async function verifyOverlayPendingMutations(page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000/parties');
  const app = page.frameLocator('iframe[title="partner-ops"]');
  const surface = page.frameLocator('[role="dialog"] iframe');
  const results = [];
  for (const kind of ['PATCH', 'DELETE']) {
    let release;
    let arrived;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    const started = new Promise((resolve) => {
      arrived = resolve;
    });
    const intercept = async (route) => {
      if (route.request().method() !== kind) return route.continue();
      arrived();
      await gate;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { id: 'mock-overlay-result' } }),
      });
    };
    await page.route('**/api/parties/**', intercept);
    try {
      await app
        .getByRole('button', { name: kind === 'PATCH' ? 'View' : 'Delete', exact: true })
        .first()
        .click();
      if (kind === 'PATCH') {
        const name = surface.getByRole('textbox', { name: /^Name/ });
        await name.waitFor();
        if (!(await name.inputValue())) throw new Error('Edit form lost initial values');
      }
      await surface
        .getByRole('button', { name: kind === 'PATCH' ? 'Save changes' : 'Delete', exact: true })
        .click();
      await started;
      await surface.locator('body').press('Escape');
      await page.locator('.MuiBackdrop-root').click({ position: { x: 3, y: 3 }, force: true });
      if (!(await page.getByRole('dialog').isVisible()))
        throw new Error(`${kind} closed during a pending request`);
      release();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      results.push({ kind, guardedPending: true, completed: true });
    } finally {
      release();
      await page.unroute('**/api/parties/**', intercept);
    }
  }
  return results;
}
