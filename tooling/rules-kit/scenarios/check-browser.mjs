import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// Accepts a Playwright Page from the evaluator's existing browser tool/installation.
// No Playwright package is bundled or installed by the rule library.
export async function checkBrowserScenario(page, id, url, artifactDirectory) {
  assert.ok(['ui-actions', 'ui-long-label'].includes(id), 'Select a UI implementation case');
  const errors = [];
  const onPageError = (error) => errors.push(error.message);
  const onRequestFailed = (request) => errors.push(request.url());
  const onResponse = (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  };
  page.on('pageerror', onPageError);
  page.on('requestfailed', onRequestFailed);
  page.on('response', onResponse);
  const observations = [];
  try {
    if (artifactDirectory) await mkdir(artifactDirectory, { recursive: true });
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(url);
      const metrics = await page.evaluate(() => {
        const buttons = [...document.querySelectorAll('.party-actions button')];
        const orders = [...document.querySelectorAll('.order-actions button')];
        const label = document.querySelector('.export-button');
        return {
          actionTops: buttons.map((button) => button.getBoundingClientRect().top),
          actionVisible: buttons.every(
            (button) =>
              button.getBoundingClientRect().width > 0 &&
              getComputedStyle(button).visibility !== 'hidden',
          ),
          orderWraps: orders[1].getBoundingClientRect().top > orders[0].getBoundingClientRect().top,
          fullLabel:
            label.scrollWidth <= label.clientWidth + 1 &&
            label.scrollHeight <= label.clientHeight + 1,
          labelFontSize: parseFloat(getComputedStyle(label).fontSize),
          pageOverflows: document.documentElement.scrollWidth > innerWidth,
          partyWrap: getComputedStyle(document.querySelector('.party-actions')).flexWrap,
        };
      });
      assert.equal(metrics.pageOverflows, false, `Page overflow at ${width}px`);
      assert.equal(metrics.actionVisible, true, 'Required actions are visible');
      assert.equal(metrics.orderWraps, true, 'Unrelated Orders layout must retain wrapping');
      assert.equal(
        await page.getByRole('button', { name: 'Delete', exact: true }).isDisabled(),
        true,
        'Delete permission must remain disabled',
      );
      if (id === 'ui-actions')
        assert.ok(
          Math.max(...metrics.actionTops) - Math.min(...metrics.actionTops) < 2,
          `Actions wrap at ${width}px`,
        );
      else {
        assert.equal(metrics.fullLabel, true, `Label clips at ${width}px`);
        assert.ok(metrics.labelFontSize >= 16, 'Do not shrink text to hide clipping');
        assert.equal(
          metrics.partyWrap,
          'wrap',
          'Unrelated party layout contract must remain unchanged',
        );
      }
      await page.getByRole('button', { name: 'Payment', exact: true }).click();
      assert.equal(await page.locator('#result').textContent(), 'payment');
      await page.getByRole('button', { name: 'View', exact: true }).focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#result').textContent(), 'view');
      await page
        .getByRole('button', { name: 'Export all selected payment records', exact: true })
        .click();
      assert.equal(await page.locator('#result').textContent(), 'export');
      if (artifactDirectory)
        await page.screenshot({
          path: join(artifactDirectory, `${id}-${width}.png`),
          fullPage: true,
        });
      observations.push({ width, ...metrics });
    }
    assert.deepEqual(errors, [], 'Unexpected browser/network errors');
    return {
      id,
      observations,
      errors,
      accepted: null,
      reviewRequired:
        'Inspect screenshots and agent trace; DOM assertions alone do not establish full visual quality.',
    };
  } finally {
    page.off('pageerror', onPageError);
    page.off('requestfailed', onRequestFailed);
    page.off('response', onResponse);
  }
}
