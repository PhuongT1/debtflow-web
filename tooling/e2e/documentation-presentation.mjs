/** Run against docs:dev or docs:preview; exercises the shared Markdown renderer. */
export async function verifyDocumentationPresentation(
  page,
  { baseUrl = 'http://127.0.0.1:4317' } = {},
) {
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on('pageerror', onError);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseUrl}/ai-guide/project-context/client-setup/`);
    await page.waitForSelector('#details .guide-step');
    const source = await page.locator('#details').innerText();
    if (!source.includes('Step 4: Give your first task'))
      throw new Error('Setup sequence is incomplete');
    const linksUnderlined = await page
      .locator('#details a')
      .evaluateAll((links) =>
        links.every((link) => getComputedStyle(link).textDecorationLine.includes('underline')),
      );
    if (!linksUnderlined) throw new Error('Article links must be identifiable without hover');
    const fixture = await page.evaluate(async () => {
      const { appendCode, codeBlock } = await import(new URL('/code-block.js', location.href));
      const sample =
        '# Check installation\nTOOL_MODE=test claude --version && echo "<img src=x onerror=alert(1)>"\n';
      const { frame, pre } = codeBlock('bash');
      frame.id = 'code-copy-fixture';
      appendCode(pre, sample, 'bash');
      document.querySelector('#details').append(frame);
      const plain = document.createElement('pre');
      appendCode(plain, '<script>alert(1)</script>', 'unknown');
      const descriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
      window.__docsClipboardDescriptor = descriptor;
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (value) => {
            window.__docsCopied = value;
          },
        },
      });
      return {
        sample,
        exact: pre.textContent === sample,
        safe: !pre.querySelector('img, script') && !plain.querySelector('script'),
        commands: [...pre.querySelectorAll('.syntax-command')].map((el) => el.textContent),
        flag: pre.querySelector('.syntax-flag')?.textContent,
        plain: plain.textContent,
      };
    });
    await page.locator('#code-copy-fixture button').click();
    const copied = await page.evaluate(() => {
      const value = window.__docsCopied;
      if (window.__docsClipboardDescriptor)
        Object.defineProperty(navigator, 'clipboard', window.__docsClipboardDescriptor);
      else delete navigator.clipboard;
      delete window.__docsCopied;
      delete window.__docsClipboardDescriptor;
      document.querySelector('#code-copy-fixture').remove();
      return value;
    });
    if (
      !fixture.exact ||
      !fixture.safe ||
      copied !== fixture.sample ||
      fixture.flag !== '--version' ||
      fixture.commands.join(',') !== 'claude,echo'
    ) {
      throw new Error(`Code formatting/copy safety failed: ${JSON.stringify(fixture)}`);
    }
    await page.getByRole('link', { name: 'Step 2: Open your AI tool', exact: true }).click();
    if (!page.url().endsWith('#step-2-open-your-ai-tool'))
      throw new Error('Step anchor navigation failed');
    await page.screenshot({ path: '/tmp/debtflow-docs-terminal-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/getting-started/run-project/`);
    await page.waitForSelector('#details .guide-step');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    if (overflow) throw new Error('Mobile article overflows the page');
    await page
      .locator('#step-1-select-the-nodejs-version')
      .evaluate((node) => node.scrollIntoView({ block: 'start' }));
    await page.screenshot({ path: '/tmp/debtflow-docs-setup-mobile.png' });
    if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
    return {
      baseUrl,
      steps: 4,
      exactCopy: true,
      safeCode: true,
      underlinedLinks: true,
      anchor: true,
      mobileOverflow: false,
    };
  } finally {
    page.off('pageerror', onError);
  }
}
