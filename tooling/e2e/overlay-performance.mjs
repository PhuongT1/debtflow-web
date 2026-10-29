/** Read-only regression: opening/closing dialogs must reuse one loaded runtime. */
export async function verifyOverlayPerformance(
  page,
  { baseUrl = 'http://localhost:3000', embedded = true } = {},
) {
  const errors = [];
  const documents = [];
  const onConsole = (message) => {
    if (message.type() === 'error') errors.push(message.text());
  };
  const onRequest = (request) => {
    if (request.isNavigationRequest() && request.url().includes('/__embed/overlays'))
      documents.push(request.url());
  };
  page.on('console', onConsole);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseUrl}/parties`);
    const app = embedded ? page.frameLocator('iframe[title="partner-ops"]') : page;
    await app.getByRole('button', { name: 'View', exact: true }).first().waitFor();
    page.on('request', onRequest);
    const timings = [];
    let marker;
    for (let index = 0; index < 4; index++) {
      const expected = (
        await app
          .getByRole('row')
          .nth(index + 1)
          .getByRole('cell')
          .first()
          .innerText()
      ).trim();
      const start = Date.now();
      await app.getByRole('button', { name: 'View', exact: true }).nth(index).click();
      await page.getByRole('dialog').waitFor({ state: 'visible' });
      timings.push(Date.now() - start);
      const content = embedded ? page.frameLocator('iframe[data-overlay-runtime]') : page;
      if ((await content.getByRole('textbox', { name: /^Name/ }).inputValue()) !== expected)
        throw new Error('Reused dialog has the wrong row data');
      if (embedded) {
        const identity = await content.locator('body').evaluate(() => performance.timeOrigin);
        if (marker !== undefined && marker !== identity)
          throw new Error('Overlay runtime reloaded');
        marker = identity;
      }
      await content.getByRole('button', { name: 'Close', exact: true }).click();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
    }
    await app.getByRole('button', { name: 'Add partner', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'visible' });
    const content = embedded ? page.frameLocator('iframe[data-overlay-runtime]') : page;
    if ((await content.getByRole('textbox', { name: /^Name/ }).inputValue()) !== '')
      throw new Error('Edit values leaked into the create form');
    await content.getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
    if (errors.length) throw new Error(errors.join('\n'));
    if (documents.length) throw new Error('A modal click loaded a new document');
    if (embedded && timings.slice(1).some((value) => value > 750))
      throw new Error(`Repeated opens exceeded the interactive budget: ${timings}`);
    return {
      embedded,
      openMs: timings,
      overlayDocumentLoads: documents.length,
      correctRowData: true,
      createReset: true,
      consoleErrors: 0,
    };
  } finally {
    page.off('console', onConsole);
    page.off('request', onRequest);
  }
}
