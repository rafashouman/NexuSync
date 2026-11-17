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
const mocks = {
  'next/headers': { headers: async () => new Map([['x-real-ip', `test-${++requestNumber}`]]) },
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
    console, Date, Map, process: { env: testEnv },
  });
  return exports;
}
mocks['@/data/marketingPlans'] = load('src/data/marketingPlans.ts');
mocks['@/lib/quote'] = load('src/lib/quote.ts');
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
