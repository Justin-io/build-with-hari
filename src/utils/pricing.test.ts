import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEstimate,
  formatINR,
  PROJECT_TYPES,
  COMPLEXITY_CONFIG,
  MICRO_ADD_ON_OPTIONS,
  LARGER_ADD_ON_OPTIONS,
  ADDITIONAL_WEB_PAGE_PRICE,
} from './pricing';

test('Base project prices match the required tiers exactly', () => {
  assert.equal(PROJECT_TYPES.web_app.basePrice, 699);
  assert.equal(PROJECT_TYPES.python_script.basePrice, 599);
  assert.equal(PROJECT_TYPES.data_science.basePrice, 999);
  assert.equal(PROJECT_TYPES.ai_ml.basePrice, 1299);
  assert.equal(PROJECT_TYPES.custom_build.basePrice, 999);
  assert.equal(PROJECT_TYPES.micro_tweak.basePrice, 0);
  assert.equal(ADDITIONAL_WEB_PAGE_PRICE, 99);
});

test('Ultra-low-cost micro add-ons match specified pricing table', () => {
  const getMicroPrice = (id: string) => MICRO_ADD_ON_OPTIONS.find((m) => m.id === id)?.price;

  assert.equal(getMicroPrice('micro_chart'), 10);
  assert.equal(getMicroPrice('micro_graph'), 10);
  assert.equal(getMicroPrice('micro_flowchart'), 20);
  assert.equal(getMicroPrice('micro_color'), 20);
  assert.equal(getMicroPrice('micro_ppt_adjust'), 20);
  assert.equal(getMicroPrice('micro_diagram'), 20);
  assert.equal(getMicroPrice('micro_viva_5'), 20);
  assert.equal(getMicroPrice('micro_report_adjust'), 30);
  assert.equal(getMicroPrice('micro_text_rev'), 10);
  assert.equal(getMicroPrice('micro_web_page'), 99);
});

test('Larger add-ons match specified pricing table', () => {
  const getLargerPrice = (id: string) => LARGER_ADD_ON_OPTIONS.find((l) => l.id === id)?.price;

  assert.equal(getLargerPrice('larger_ppt'), 299);
  assert.equal(getLargerPrice('larger_report'), 199);
  assert.equal(getLargerPrice('larger_db'), 299);
  assert.equal(getLargerPrice('larger_auth'), 299);
  assert.equal(getLargerPrice('larger_dashboard'), 149);
  assert.equal(getLargerPrice('larger_deploy'), 199);
});

test('Base web app price calculates accurately with 1 extra page', () => {
  const result = calculateEstimate({
    projectType: 'web_app',
    complexity: 'basic',
    webPagesCount: 2, // 1 included + 1 extra @ 99
    selectedScopeFeatures: [],
    microAddOns: {},
    selectedLargerAddOns: [],
    deliverySpeed: 'standard',
  });

  assert.equal(result.basePrice, 699);
  assert.equal(result.pagesPrice, 99);
  assert.equal(result.subtotal, 699 + 99);
  assert.equal(result.totalINR, 798);
});

test('Micro-edits calculate accurately with quantities', () => {
  const result = calculateEstimate({
    projectType: 'micro_tweak', // 0 base price
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: {
      micro_viva_5: 2, // 2 * 20 = 40
      micro_report_adjust: 1, // 30
      micro_text_rev: 2, // 2 * 10 = 20
    },
    selectedLargerAddOns: [],
    deliverySpeed: 'standard',
  });

  // Total should be 40 + 30 + 20 = 90
  assert.equal(result.basePrice, 0);
  assert.equal(result.microAddOnsPrice, 90);
  assert.equal(result.totalINR, 90);
});

test('Deduplication rule: Do not charge twice for charts already included in Dashboard', () => {
  const result = calculateEstimate({
    projectType: 'web_app', // 699
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: {
      micro_chart: 1, // should be waived because larger_dashboard is selected
    },
    selectedLargerAddOns: ['larger_dashboard'], // 149
    deliverySpeed: 'standard',
  });

  // Chart should be waived (0), so microAddOnsPrice = 0
  assert.equal(result.microAddOnsPrice, 0);
  assert.equal(result.largerAddOnsPrice, 149);
  assert.equal(result.subtotal, 699 + 149);
  assert.equal(result.totalINR, 848);

  const waivedLine = result.itemizedLines.find((l) => l.label.includes('simple chart'));
  assert.ok(waivedLine);
  assert.equal(waivedLine.amount, 0);
  assert.equal(waivedLine.isIncludedFree, true);
});

test('Custom build routes to scope review confirmation', () => {
  const result = calculateEstimate({
    projectType: 'custom_build', // 999+
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: {},
    selectedLargerAddOns: [],
    deliverySpeed: 'standard',
  });

  assert.equal(result.basePrice, 999);
  assert.equal(result.isSubjectToScopeReview, true);
  assert.ok(result.scopeReviewReasons.length > 0);
});

test('Delivery surcharges calculate accurately (Urgent +30%, Express +50%)', () => {
  const urgentResult = calculateEstimate({
    projectType: 'python_script', // 599
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: { micro_flowchart: 1 }, // 20
    selectedLargerAddOns: [],
    deliverySpeed: 'urgent', // +30%
  });

  // Subtotal = 599 + 20 = 619
  assert.equal(urgentResult.subtotal, 619);
  // Surcharge: round(619 * 0.3) = 186
  assert.equal(urgentResult.deliverySurchargeAmount, 186);
  assert.equal(urgentResult.totalINR, 619 + 186);

  const expressResult = calculateEstimate({
    projectType: 'python_script', // 599
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: { micro_flowchart: 1 }, // 20
    selectedLargerAddOns: [],
    deliverySpeed: 'express', // +50%
  });

  // Surcharge: round(619 * 0.5) = 310
  assert.equal(expressResult.deliverySurchargeAmount, 310);
  assert.equal(expressResult.totalINR, 619 + 310);
});

test('formatINR formats currency properly in Indian numbering', () => {
  assert.match(formatINR(699), /₹\s?699/);
  assert.match(formatINR(10), /₹\s?10/);
  assert.match(formatINR(1299), /₹\s?1,299/);
});
