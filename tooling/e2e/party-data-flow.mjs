import assert from 'node:assert/strict';

/** Uses real reads and mocked writes; never creates or deletes a business record. */
export async function verifyPartyDataFlow(page, shellUrl = 'http://localhost:3000') {
  const writes = [];
  let reads = 0;
  const onRequest = (request) => {
    if (request.method() === 'GET' && new URL(request.url()).pathname === '/api/parties') reads++;
  };
  const pattern = '**/api/parties';
  const mockWrite = async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') return route.continue();
    writes.push({ body: request.postDataJSON(), headers: request.headers() });
    const attempt = writes.length;
    await route.fulfill({
      status: attempt === 1 ? 422 : attempt === 2 ? 503 : 200,
      contentType: 'application/json',
      body: JSON.stringify(
        attempt === 1
          ? {
              error: {
                message: 'Validation failed',
                details: [{ field: 'name', message: 'Name already exists', code: 'duplicate' }],
              },
            }
          : attempt === 2
            ? { message: 'Temporary service failure' }
            : { success: true, data: { id: 'mock-only-partner' } },
      ),
    });
  };
  page.on('request', onRequest);
  await page.route(pattern, mockWrite);
  try {
    await page.goto(new URL('/parties', shellUrl).href);
    await page.getByRole('button', { name: /Choose language|Chọn ngôn ngữ/ }).click();
    await page.getByRole('menuitem', { name: '🇬🇧 English (EN)', exact: true }).click();
    const frame = page.frameLocator('iframe[title="partner-ops"]');
    await frame.getByRole('heading', { name: 'Customers / Suppliers', exact: true }).waitFor();
    await frame.getByRole('button', { name: 'Add partner', exact: true }).click();
    const dialog = frame.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Create partner', exact: true }).click();
    await dialog.getByText('Enter a partner name', { exact: true }).waitFor();
    assert.equal(writes.length, 0, 'Invalid form must not send a request');
    await dialog.getByRole('textbox', { name: 'Name *', exact: true }).fill('Mock transport check');

    // Changing locale must preserve the draft and retranslate active validation.
    await page.getByRole('button', { name: 'Choose language', exact: true }).click();
    await page.getByRole('menuitem', { name: '🇻🇳 Tiếng Việt (VI)', exact: true }).click();
    assert.equal(await dialog.locator('input[name="name"]').inputValue(), 'Mock transport check');
    await page.getByRole('button', { name: 'Chọn ngôn ngữ', exact: true }).click();
    await page.getByRole('menuitem', { name: '🇬🇧 English (EN)', exact: true }).click();

    await dialog.getByRole('button', { name: 'Create partner', exact: true }).click();
    await dialog.getByText('Name already exists', { exact: true }).waitFor();
    assert.equal(await dialog.locator('input[name="name"]').inputValue(), 'Mock transport check');
    await dialog.getByRole('button', { name: 'Create partner', exact: true }).click();
    await dialog
      .getByRole('alert')
      .filter({ hasText: 'Temporary service failure' })
      .first()
      .waitFor();
    const readsBeforeSuccess = reads;
    const refreshed = page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        new URL(response.url()).pathname === '/api/parties',
    );
    await dialog.getByRole('button', { name: 'Create partner', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    await refreshed;
    assert.ok(reads > readsBeforeSuccess, 'Success must invalidate the list');
    assert.equal(writes.length, 3);
    for (const write of writes) {
      assert.equal(typeof write.body, 'object', 'JSON must not be double-serialized');
      assert.equal(write.body.name, 'Mock transport check');
      assert.equal(write.body.type, 'CUSTOMER');
      assert.equal(write.headers['x-frontend-zone'], 'partner-ops');
      assert.equal(write.headers['accept-language'], 'en');
    }
    return {
      clientValidation: true,
      draftLocalePreservation: true,
      fieldErrors: true,
      recoverableFailure: true,
      successInvalidation: true,
      jsonAndHeaders: true,
      realWrites: 0,
    };
  } finally {
    page.off('request', onRequest);
    await page.unroute(pattern, mockWrite);
    await page.getByRole('button', { name: /Choose language|Chọn ngôn ngữ/ }).click();
    await page.getByRole('menuitem', { name: '🇻🇳 Tiếng Việt (VI)', exact: true }).click();
  }
}

/** Exercise edit/delete lifecycle; all detail writes are intercepted. */
export async function verifyPartyActions(page, shellUrl = 'http://localhost:3000') {
  const writes = [];
  const pattern = '**/api/parties/*';
  let holdDelete;
  let releaseDelete;
  const deleteGate = new Promise((resolve) => {
    releaseDelete = resolve;
  });
  const mockWrite = async (route) => {
    const request = route.request();
    const method = request.method();
    if (method === 'GET') return route.continue();
    // Fail closed: no mutation to this domain may reach the backend.
    if (!['PATCH', 'DELETE'].includes(method)) return route.abort();
    writes.push({ method, path: new URL(request.url()).pathname, body: request.postDataJSON() });
    if (method === 'DELETE' && holdDelete) await deleteGate;
    const attempt = writes.filter((write) => write.method === method).length;
    await route.fulfill({
      status: attempt === 1 ? 503 : 200,
      contentType: 'application/json',
      body: JSON.stringify(
        attempt === 1 ? { message: 'Mock write failure' } : { data: { id: 'mock-only' } },
      ),
    });
  };
  await page.route(pattern, mockWrite);
  try {
    await page.goto(new URL('/parties', shellUrl).href);
    await page.getByRole('button', { name: /Choose language|Chọn ngôn ngữ/ }).click();
    await page.getByRole('menuitem', { name: '🇬🇧 English (EN)', exact: true }).click();
    const frame = page.frameLocator('iframe[title="partner-ops"]');
    const row = frame.getByRole('row').nth(1);
    await row.getByRole('button', { name: 'View', exact: true }).click();
    const dialog = frame.getByRole('dialog');
    await dialog.locator('input[name="name"]').fill('Mock edited name');
    await dialog.getByRole('button', { name: 'Save changes', exact: true }).click();
    await dialog.getByText('Mock write failure', { exact: true }).first().waitFor();
    assert.equal(await dialog.locator('input[name="name"]').inputValue(), 'Mock edited name');
    const listRefreshed = () =>
      page.waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          new URL(response.url()).pathname === '/api/parties',
      );
    let refreshed = listRefreshed();
    await dialog.getByRole('button', { name: 'Save changes', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    await refreshed;
    assert.equal(writes[0].method, 'PATCH');
    assert.equal(writes[0].body.name, 'Mock edited name');
    assert.equal(writes[0].path, writes[1].path);

    await row.getByRole('button', { name: 'Delete', exact: true }).click();
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.equal(writes.filter((write) => write.method === 'DELETE').length, 0);
    await row.getByRole('button', { name: 'Delete', exact: true }).click();
    holdDelete = true;
    await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).waitFor();
    assert.equal(
      await dialog.getByRole('button', { name: 'Cancel', exact: true }).isDisabled(),
      true,
    );
    releaseDelete();
    await dialog.getByText('Mock write failure', { exact: true }).first().waitFor();
    refreshed = listRefreshed();
    await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    await refreshed;
    assert.equal(writes.filter((write) => write.method === 'DELETE').length, 2);
    assert.equal(writes.length, 4);
    return {
      patchFailureRetry: true,
      deleteCancel: true,
      deletePending: true,
      deleteFailureRetry: true,
      mutationInvalidation: true,
      realWrites: 0,
    };
  } finally {
    releaseDelete();
    await page.unroute(pattern, mockWrite);
    await page.getByRole('button', { name: /Choose language|Chọn ngôn ngữ/ }).click();
    await page.getByRole('menuitem', { name: '🇻🇳 Tiếng Việt (VI)', exact: true }).click();
  }
}
