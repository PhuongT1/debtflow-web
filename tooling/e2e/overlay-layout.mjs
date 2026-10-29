/** Samples every animation frame; no mutations are sent. Run against a signed-in Shell. */
export async function verifyOverlayLayout(page, width = 1440) {
  await page.bringToFront();
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('http://localhost:3000/parties');
  const caller = page.frameLocator('iframe[title="partner-ops"]');
  await caller.getByRole('button', { name: 'Add partner', exact: true }).waitFor();
  await page.evaluate(() => {
    window.__overlaySamples = [];
    window.__overlaySampling = true;
    window.__overlayPhase = 'opening';
    const sample = () => {
      // Inactive route dialogs may remain mounted; measure the visible surface.
      const paper = [...document.querySelectorAll('.MuiDialog-paper')].find(
        (node) => getComputedStyle(node).visibility === 'visible',
      );
      if (paper) {
        const iframe = paper.querySelector('iframe');
        window.__overlaySamples.push({
          phase: window.__overlayPhase,
          height: paper.offsetHeight,
          width: paper.offsetWidth,
          content: iframe?.contentDocument?.body.innerText.length ?? 0,
        });
      }
      if (window.__overlaySampling) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await caller.getByRole('button', { name: 'Add partner', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor({ state: 'visible' });
  const body = page.frameLocator('iframe[data-overlay-session]');
  await body.getByRole('textbox', { name: /^Name/ }).waitFor();
  await page.waitForTimeout(300);
  const measuredHeight = await dialog.evaluate((node) => node.offsetHeight);
  await page.evaluate(() => {
    window.__overlayPhase = 'closing';
  });
  await body.getByRole('button', { name: 'Close', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  const samples = await page.evaluate(() => {
    window.__overlaySampling = false;
    const result = window.__overlaySamples;
    delete window.__overlaySamples;
    return result;
  });
  const opening = samples.filter((s) => s.phase === 'opening');
  const closing = samples.filter((s) => s.phase === 'closing');
  if (!opening.length || !closing.length)
    throw new Error(
      `No animation frames captured: opening=${opening.length}, closing=${closing.length}`,
    );
  const bad = samples.filter((s) => Math.abs(s.height - measuredHeight) > 1 || !s.content);
  if (bad.length) throw new Error(`Empty or jumping dialog frames: ${JSON.stringify(bad)}`);
  return {
    width,
    openingFrames: opening.length,
    closingFrames: closing.length,
    height: measuredHeight,
    emptyFrames: 0,
    temporaryHeightFrames: 0,
  };
}

/** Critical initial data must resolve before the modal is revealed. */
export async function verifyDeferredOverlayLayout(page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const caller = page.frameLocator('iframe[title="partner-ops"]');
  let release;
  let arrived;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const started = new Promise((resolve) => {
    arrived = resolve;
  });
  const hold = async (route) => {
    if (!route.request().frame().url().includes('/__embed/overlays')) return route.continue();
    arrived();
    await gate;
    return route.continue();
  };
  await page.route('**/api/users/options', hold);
  await page.goto('http://localhost:3000/parties');
  await caller.getByRole('button', { name: 'Add partner', exact: true }).waitFor();
  try {
    await caller.getByRole('button', { name: 'Add partner', exact: true }).click();
    await started;
    await page.waitForTimeout(200);
    if (await page.getByRole('dialog').count())
      throw new Error('Modal was revealed before required data loaded');
    release();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    await page
      .frameLocator('iframe[data-overlay-session]')
      .getByRole('button', { name: 'Close', exact: true })
      .click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    return { withheldUntilCriticalData: true, openedAfterData: true };
  } finally {
    release();
    await page.unroute('**/api/users/options', hold);
  }
}
