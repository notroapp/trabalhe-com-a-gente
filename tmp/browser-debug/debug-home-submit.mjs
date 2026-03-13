import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4200';

const browser = await chromium.launch({
  headless: true,
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleMessages = [];
const pageErrors = [];
const requests = [];
const responses = [];
const navEvents = [];

page.on('console', (msg) => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

page.on('pageerror', (err) => {
  pageErrors.push(String(err?.stack ?? err?.message ?? err));
});

page.on('request', (req) => {
  requests.push({
    method: req.method(),
    url: req.url(),
    resourceType: req.resourceType(),
    isNavigationRequest: req.isNavigationRequest()
  });
});

page.on('response', (res) => {
  responses.push({
    status: res.status(),
    url: res.url()
  });
});

page.on('framenavigated', (frame) => {
  if (frame === page.mainFrame()) {
    navEvents.push({
      url: frame.url(),
      at: Date.now()
    });
  }
});

await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle');

const urlBeforeSubmit = page.url();
const input = page.locator('input[aria-label="Digite os termos de busca"]');
await input.fill('node');

const clickTrace = [];
await page.exposeFunction('recordClickTrace', (eventName, target) => {
  clickTrace.push({ eventName, target });
});

await page.evaluate(() => {
  const form = document.querySelector('form.search-form');
  const button = form?.querySelector('button[type="submit"]');
  const add = (el, name, label) => {
    if (!el) return;
    el.addEventListener(name, () => {
      // @ts-ignore
      window.recordClickTrace(name, label);
    });
  };
  add(button, 'click', 'submit-button');
  add(form, 'submit', 'search-form');
});

const submitButton = page.getByRole('button', { name: /Pesquisar|Search/i });
await submitButton.click({ timeout: 10_000 });

const urlTimeline = [{ label: 'immediate', url: page.url() }];
await page.waitForTimeout(150);
urlTimeline.push({ label: '150ms', url: page.url() });
await page.waitForTimeout(400);
urlTimeline.push({ label: '550ms', url: page.url() });
await page.waitForTimeout(800);
urlTimeline.push({ label: '1350ms', url: page.url() });
await page.waitForTimeout(1500);
urlTimeline.push({ label: '2850ms', url: page.url() });

const docNavType = await page.evaluate(() => {
  // @ts-ignore
  const nav = performance.getEntriesByType('navigation')[0];
  // @ts-ignore
  return nav?.type ?? 'unknown';
});

const graphqlRequests = requests.filter((r) => r.url.includes('/graphql'));
const graphqlResponses = responses.filter((r) => r.url.includes('/graphql'));
const failedResponses = responses.filter((r) => r.status >= 400);

const result = {
  baseUrl: BASE_URL,
  urlBeforeSubmit,
  urlAfterWait: page.url(),
  urlTimeline,
  docNavigationType: docNavType,
  navEvents,
  clickTrace,
  graphqlRequests,
  graphqlResponses,
  failedResponses,
  pageErrors,
  consoleErrors: consoleMessages.filter((m) => m.type === 'error'),
  consoleWarns: consoleMessages.filter((m) => m.type === 'warning')
};

console.log(JSON.stringify(result, null, 2));

await browser.close();
