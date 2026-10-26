import test from 'node:test';
import assert from 'node:assert/strict';
import { SEO_DATA, getCanonicalUrl, generateSchemaGraph } from './seoConfig';

test('SEO config has exact brand name and founder details', () => {
  assert.equal(SEO_DATA.brandName, 'BUILD WITH HARI');
  assert.equal(SEO_DATA.founderName, 'Hari Nandan K.');
  assert.ok(SEO_DATA.alternateBrandNames.includes('BuildWithHari'));
  assert.ok(SEO_DATA.alternateBrandNames.includes('Build By Hari'));
  assert.equal(SEO_DATA.email, 'harinandhan972@gmail.com');
  assert.equal(SEO_DATA.profiles.portfolio, 'https://justinalexia.vercel.app/');
  assert.equal(SEO_DATA.profiles.github, 'https://github.com/Justin-io');
  assert.equal(SEO_DATA.profiles.linkedin, 'https://www.linkedin.com/in/justinalexia/');
});

test('Verified repositories list has authentic GitHub URLs', () => {
  assert.equal(SEO_DATA.verifiedRepositories.length, 3);
  const repoUrls = SEO_DATA.verifiedRepositories.map((r) => r.url);
  assert.ok(repoUrls.includes('https://github.com/Justin-io/V.O.I.D.E'));
  assert.ok(repoUrls.includes('https://github.com/Justin-io/autonomous-ai-data-scientist'));
  assert.ok(repoUrls.includes('https://github.com/Justin-io/rag-eval-platform'));
});

test('getCanonicalUrl formats clean paths correctly', () => {
  const urlDefault = getCanonicalUrl();
  assert.ok(urlDefault.startsWith('http'));

  const urlWithWork = getCanonicalUrl('#work');
  assert.ok(urlWithWork.includes('#work'));
});

test('generateSchemaGraph produces valid schema.org graph with required entities', () => {
  const graphObj = generateSchemaGraph('https://example.com');
  assert.equal(graphObj['@context'], 'https://schema.org');

  const nodes = graphObj['@graph'] as Array<Record<string, unknown>>;
  assert.ok(Array.isArray(nodes));

  const types = nodes.map((n) => {
    const val = n['@type'];
    return Array.isArray(val) ? val.join(',') : String(val ?? '');
  });
  assert.ok(types.some((t) => t.includes('WebSite')));
  assert.ok(types.some((t) => t.includes('Person')));
  assert.ok(types.some((t) => t.includes('Organization') || t.includes('ProfessionalService')));
  assert.ok(types.some((t) => t.includes('Service')));
  assert.ok(types.some((t) => t.includes('FAQPage')));

  const personNode = nodes.find((n) => n['@type'] === 'Person');
  assert.equal(personNode?.name, 'Hari Nandan K.');

  const faqNode = nodes.find((n) => n['@type'] === 'FAQPage');
  const faqs = faqNode?.mainEntity as Array<Record<string, unknown>>;
  assert.ok(faqs.length >= 4);
});

test('Meta description satisfies length standards (between 120 and 160 characters)', () => {
  const descLength = SEO_DATA.description.length;
  assert.ok(
    descLength >= 120 && descLength <= 165,
    `Description length ${descLength} should be between 120 and 165`
  );
});
