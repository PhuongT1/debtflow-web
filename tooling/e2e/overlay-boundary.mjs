/** Origin/window spoofing, unknown views and cancellation while content is loading. */
export async function verifyOverlayHostBoundary(page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000/parties');
  const app = page.frameLocator('iframe[title="partner-ops"]');
  await app.getByRole('button', { name: 'Add partner', exact: true }).waitFor();
  await page.evaluate(() =>
    window.postMessage(
      {
        protocol: 'platform-overlay-v1',
        id: 'spoof-1',
        type: 'open',
        request: { view: 'help', title: 'Spoofed' },
      },
      location.origin,
    ),
  );
  await page.waitForTimeout(50);
  if (await page.getByRole('dialog').count())
    throw new Error('Host accepted a message from the wrong window');
  const remote = page.frames().find((frame) => frame.url().includes('/__embed/parties'));
  const status = await remote.evaluate(
    () =>
      new Promise((resolve) => {
        const id = 'unknown-view-test';
        const listener = (event) => {
          if (
            event.source !== window.parent ||
            event.origin !== location.origin ||
            event.data?.id !== id
          )
            return;
          window.removeEventListener('message', listener);
          resolve(event.data.result?.status);
        };
        window.addEventListener('message', listener);
        window.parent.postMessage(
          {
            protocol: 'platform-overlay-v1',
            id,
            type: 'open',
            request: { view: 'unregistered', title: 'Unknown' },
          },
          location.origin,
        );
      }),
  );
  if (status !== 'failed') throw new Error('Unregistered view was not rejected');
  const hold = (route) => route.abort();
  await page.route('**/__embed/overlays**', hold);
  await page.reload();
  try {
    await app.getByRole('button', { name: 'Add partner', exact: true }).click();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.getByRole('dialog').waitFor({ state: 'hidden' });
  } finally {
    await page.unroute('**/__embed/overlays**', hold);
  }
  return { wrongWindowIgnored: true, unknownViewRejected: true, loadingCancelled: true };
}
