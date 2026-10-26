import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateAuthoritativeEstimate } from '../src/server/pricingEngine';
import { ProjectConfig } from '../src/utils/pricing';

test('calculateAuthoritativeEstimate returns null when no config is provided', () => {
  const result = calculateAuthoritativeEstimate(null);
  assert.equal(result, null);
});

test('calculateAuthoritativeEstimate accurately calculates base price and complexity', () => {
  const config: ProjectConfig = {
    projectType: 'web_app',
    complexity: 'intermediate',
    selectedScopeFeatures: [],
    microAddOns: {},
    selectedLargerAddOns: [],
    deliverySpeed: 'standard',
  };

  const result = calculateAuthoritativeEstimate(config);
  assert.ok(result);
  assert.equal(result.basePrice, 699);
  assert.equal(result.complexityPrice, 400);
  assert.equal(result.totalINR, 699 + 400);
});

test('calculateAuthoritativeEstimate enforces micro add-on quantity caps', () => {
  const config: ProjectConfig = {
    projectType: 'python_script',
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: {
      micro_chart: 99, // Should be capped at maxQuantity (5)
    },
    selectedLargerAddOns: [],
    deliverySpeed: 'standard',
  };

  const result = calculateAuthoritativeEstimate(config);
  assert.ok(result);
  // micro_chart is ₹10 * 5 = ₹50
  assert.equal(result.microAddOnsPrice, 50);
});

test('calculateAuthoritativeEstimate applies chart deduplication with dashboard', () => {
  const config: ProjectConfig = {
    projectType: 'web_app',
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: {
      micro_chart: 2,
    },
    selectedLargerAddOns: ['larger_dashboard'],
    deliverySpeed: 'standard',
  };

  const result = calculateAuthoritativeEstimate(config);
  assert.ok(result);
  // Base 699 + larger_dashboard (149) + 1 charged chart (10) because 1 chart is covered by dashboard = 858
  assert.equal(result.microAddOnsPrice, 10);
  assert.equal(result.largerAddOnsPrice, 149);
});

test('calculateAuthoritativeEstimate applies delivery speed surcharges correctly', () => {
  const standardConfig: ProjectConfig = {
    projectType: 'web_app',
    complexity: 'basic',
    selectedScopeFeatures: [],
    microAddOns: {},
    selectedLargerAddOns: [],
    deliverySpeed: 'standard',
  };
  const urgentConfig: ProjectConfig = {
    ...standardConfig,
    deliverySpeed: 'urgent',
  };
  const expressConfig: ProjectConfig = {
    ...standardConfig,
    deliverySpeed: 'express',
  };

  const resStandard = calculateAuthoritativeEstimate(standardConfig);
  const resUrgent = calculateAuthoritativeEstimate(urgentConfig);
  const resExpress = calculateAuthoritativeEstimate(expressConfig);

  assert.ok(resStandard);
  assert.ok(resUrgent);
  assert.ok(resExpress);

  assert.equal(resStandard.totalINR, 699);
  // Urgent: +30% = Math.round(699 * 0.3) = 210 -> total 909
  assert.equal(resUrgent.deliverySurchargeRate, 0.3);
  assert.equal(resUrgent.totalINR, 699 + 210);
  // Express: +50% = Math.round(699 * 0.5) = 350 -> total 1049
  assert.equal(resExpress.deliverySurchargeRate, 0.5);
  assert.equal(resExpress.totalINR, 699 + 350);
});
