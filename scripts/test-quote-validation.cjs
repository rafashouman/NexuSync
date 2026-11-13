/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const saved = [];
let requestNumber = 0;
const mocks = {
  'next/headers': { headers: async () => new Map([['x-real-ip', `test-${++requestNumber}`]]) },
  mongodb: { ObjectId: class {} },
  '@/lib/mongodb': { getDb: async () => ({ collection: () => ({ insertOne: async (record) => saved.push(record) }) }) },
  '@/lib/admin-auth': { isAdmin: async () => false },
};
function load(path) {
  const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, require: (id) => { if (!(id in mocks)) throw new Error(`Unexpected import: ${id}`); return mocks[id]; },
    console, Date, Map,
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
  for (const overrides of [{ consentContact: false }, { contact: 'inválido' }, { interest: 'desconhecido' }, { company: 'x'.repeat(151) }, { name: '' }]) {
    assert.equal((await saveQuoteRequest({ ...base, ...overrides })).ok, false);
  }
  assert.equal(saved.length, homeInterests.length, 'Invalid requests must not create leads');
  const honeypot = await saveQuoteRequest({ ...base, website: 'bot' });
  assert.deepEqual({ ...honeypot }, { ok: true, recorded: false });
  assert.equal(saved.length, homeInterests.length, 'Honeypot must not create leads');
  console.log(`Passed: ${homeInterests.length} homepage interests, optional company, contact/consent validation, and unrecorded honeypot. No database contacted.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
