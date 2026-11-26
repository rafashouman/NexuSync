/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const saved = [];
let requestNumber = 0;
let emailDelivery = true;
let databaseAvailable = true;
const testEnv = {};
const notifications = [];
const notificationStatuses = [];
const afterTasks = [];
const metaRequests = [];
let metaResponse = async () => ({ ok: true });
const mocks = {
  'next/headers': {
    headers: async () => new Map([['x-real-ip', `test-${++requestNumber}`], ['user-agent', 'teste']]),
    cookies: async () => new Map([['_fbp', { value: 'fb.1.1.123' }]]),
  },
  'next/server': { after: (task) => afterTasks.push(task) },
  'node:crypto': require('node:crypto'),
  mongodb: { ObjectId: class {} },
  '@/lib/mongodb': { getDb: async () => {
    if (!databaseAvailable) throw new Error('Simulated database outage');
    return { collection: () => ({
      insertOne: async (record) => { saved.push(record); return { insertedId: String(saved.length) }; },
      updateOne: async (filter, update) => notificationStatuses.push(update.$set),
    }) };
  } },
  '@/lib/quote-notification': { notifyQuote: async (input) => { notifications.push(input); return emailDelivery; } },
  '@/lib/admin-auth': { isAdmin: async () => false },
};
function load(path) {
  const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, require: (id) => { if (!(id in mocks)) throw new Error(`Unexpected import: ${id}`); return mocks[id]; },
    console, Date, Map, URL, URLSearchParams, AbortSignal, process: { env: testEnv },
    fetch: async (url, init) => { metaRequests.push({ url, body: init.body }); return metaResponse(); },
  });
  return exports;
}
mocks['@/data/marketingPlans'] = load('src/data/marketingPlans.ts');
mocks['@/lib/quote'] = load('src/lib/quote.ts');
mocks['@/lib/meta'] = load('src/lib/meta.ts');
mocks['@/lib/meta-capi'] = load('src/lib/meta-capi.ts');

async function testMeta(saveQuoteRequest, base) {
  const sha256 = (value) => require('node:crypto').createHash('sha256').update(value).digest('hex');
  const runAfter = async () => { for (const task of afterTasks.splice(0)) await task(); };
  const lastEvent = () => JSON.parse(metaRequests.at(-1).body.get('data'))[0];
  const tracking = { eventId: 'teste-evento-1', sourceUrl: 'https://nexusync.online/contato?fbclid=abc' };

  await saveQuoteRequest(base);
  assert.equal(afterTasks.length, 0, 'Without cookie consent nothing goes to Meta');

  await saveQuoteRequest({ ...base, tracking });
  await runAfter();
  assert.equal(metaRequests.length, 0, 'Without a token nothing goes to Meta');

  testEnv.META_CAPI_ACCESS_TOKEN = 'test-only';
  await saveQuoteRequest({ ...base, name: 'Maria da Silva', contact: 'Maria@Example.com', message: 'segredo', tracking });
  await runAfter();
  assert.ok(metaRequests.at(-1).url.endsWith('/1587285682708459/events'));
  const event = lastEvent();
  assert.equal(event.event_name, 'Lead');
  assert.equal(event.event_id, tracking.eventId);
  assert.equal(event.user_data.em[0], sha256('maria@example.com'));
  assert.equal(event.user_data.fn[0], sha256('maria'));
  assert.equal(event.user_data.ln[0], sha256('silva'));
  assert.equal(event.user_data.fbp, 'fb.1.1.123');
  assert.match(event.user_data.fbc, /^fb\.1\.\d+\.abc$/);
  assert.ok(!/Maria|segredo/i.test(JSON.stringify(event)), 'No raw personal data in the payload');

  await saveQuoteRequest({ ...base, contact: '(51) 99999-0000', tracking });
  await runAfter();
  assert.equal(lastEvent().user_data.ph[0], sha256('5551999990000'));
  const { normalizePhone } = mocks['@/lib/meta-capi'];
  assert.equal(normalizePhone('+55 51 99999-0000'), '5551999990000');
  assert.equal(normalizePhone('99999-0000'), null);

  metaResponse = async () => { throw new Error('Meta unavailable'); };
  const result = await saveQuoteRequest({ ...base, tracking });
  await runAfter();
  assert.equal(result.recorded, true, 'Meta outage must not affect the lead');

  const { pixelForEvent, AGENCY_PATHS } = mocks['@/lib/meta'];
  assert.ok(pixelForEvent('/contato', 'Lead'));
  assert.ok(pixelForEvent('/sites-para/dentistas', 'Contact'));
  assert.equal(pixelForEvent('/templates/academias', 'Lead'), null);
  assert.equal(pixelForEvent('/pulsespin', 'Lead'), null);
  assert.ok(pixelForEvent('/templates/academias', 'PageView'));
  assert.equal(pixelForEvent('/admin/orcamentos', 'PageView'), null);
  const sitePages = fs.readdirSync('src/app/(site)', { recursive: true })
    .map((file) => String(file).replaceAll('\\', '/'))
    .filter((file) => /(^|\/)page\.tsx$/.test(file) && !file.includes('['))
    .map((file) => `/${file.replace(/\/?page\.tsx$/, '')}`);
  assert.deepEqual([...AGENCY_PATHS].sort(), sitePages.sort(), 'AGENCY_PATHS must match the (site) pages');
  console.log('Passed: Meta conversions respect consent, hash personal data, survive outages and skip demo pages. Nothing sent.');
}
const { saveQuoteRequest } = load('src/app/actions/quotes.ts');
const homeInterests = mocks['@/lib/quote'].HOME_QUOTE_INTERESTS.map(({ id }) => id);
const base = {
  name: 'Teste local', company: '', segment: 'Serviços', contact: 'teste@example.com',
  goal: 'projeto', interest: 'landing-page', budget: '', message: '',
  consentContact: true, consentPromo: false, website: '',
};
(async () => {
  for (const interest of homeInterests) {
    const result = await saveQuoteRequest({ ...base, interest });
    assert.equal(result.ok, true);
    assert.equal(result.recorded, true);
    assert.equal(saved.at(-1).interest, interest);
    assert.equal(saved.at(-1).company, '');
  }
  for (const overrides of [{ consentContact: false }, { contact: 'inválido' }, { interest: 'desconhecido' }, { company: 'x'.repeat(151) }, { name: '' }, { channel: 'invalid' }]) {
    assert.equal((await saveQuoteRequest({ ...base, ...overrides })).ok, false);
  }
  assert.equal(saved.length, homeInterests.length, 'Invalid requests must not create leads');
  const honeypot = await saveQuoteRequest({ ...base, website: 'bot' });
  assert.deepEqual({ ...honeypot }, { ok: true, recorded: false });
  assert.equal(saved.length, homeInterests.length, 'Honeypot must not create leads');
  for (const channel of ['email', 'whatsapp']) {
    const result = await saveQuoteRequest({ ...base, channel, interest: 'seo' });
    assert.equal(result.ok, true);
    assert.equal(result.emailSent, true);
    assert.equal(saved.at(-1).channel, channel);
    assert.equal(notifications.at(-1).channel, channel);
    assert.equal(notifications.at(-1).interest, 'SEO e presença no Google');
    assert.equal(notificationStatuses.at(-1).emailStatus, 'sent');
  }
  await testMeta(saveQuoteRequest, base);
  emailDelivery = false;
  const emailFailure = await saveQuoteRequest({ ...base, channel: 'email' });
  assert.equal(emailFailure.ok, true, 'SMTP outage must not lose the saved lead');
  assert.equal(emailFailure.recorded, true);
  assert.equal(emailFailure.emailSent, false);
  assert.equal(notificationStatuses.at(-1).emailStatus, 'failed');
  const notificationCount = notifications.length;
  databaseAvailable = false;
  assert.equal((await saveQuoteRequest(base)).ok, false);
  assert.equal(notifications.length, notificationCount, 'Do not notify when persistence fails');
  let smtpFailure = false;
  let mail;
  mocks.nodemailer = { createTransport: () => ({
    sendMail: async (input) => { if (smtpFailure) throw new Error('SMTP unavailable'); mail = input; },
    close: () => {},
  }) };
  const { notifyQuote } = load('src/lib/quote-notification.ts');
  const notification = { ...notifications[0], channel: 'email' };
  assert.equal(await notifyQuote(notification), false, 'Missing SMTP credentials are reported');
  Object.assign(testEnv, { HOSTINGER_SMTP_USER: 'sender@example.com', HOSTINGER_SMTP_PASS: 'test-only', NEXUSYNC_NOTIFY_EMAIL: 'owner@example.com' });
  assert.equal(await notifyQuote(notification), true);
  assert.equal(mail.to, 'owner@example.com');
  assert.equal(mail.replyTo, base.contact);
  assert.ok(mail.text.includes(notification.interest));
  assert.ok(mail.text.includes(notification.id));
  smtpFailure = true;
  assert.equal(await notifyQuote(notification), false, 'SMTP exceptions are contained');
  console.log('Passed: SMTP configuration, notification recipient, reply-to, subject context, missing credentials and send failure. No email sent.');
  console.log('Passed: email and WhatsApp channels, selected subject, SMTP failure preserves lead, database outage prevents notification.');
  console.log(`Passed: ${homeInterests.length} homepage interests, optional company, contact/consent validation, and unrecorded honeypot. No database contacted.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
