import {
  calculateEstimate,
  ProjectConfig,
  EstimateResult,
  PROJECT_TYPES,
  COMPLEXITY_CONFIG,
  MICRO_ADD_ON_OPTIONS,
  LARGER_ADD_ON_OPTIONS,
  formatINR,
} from '../utils/pricing';

export function calculateAuthoritativeEstimate(config?: ProjectConfig | null): EstimateResult | null {
  if (!config) return null;

  // Sanitize and normalize config
  const sanitizedConfig: ProjectConfig = {
    projectType: config.projectType,
    complexity: config.complexity,
    webPagesCount: config.webPagesCount && config.webPagesCount > 0 ? Math.min(20, Math.floor(config.webPagesCount)) : 1,
    selectedScopeFeatures: Array.isArray(config.selectedScopeFeatures)
      ? config.selectedScopeFeatures.filter((id) => typeof id === 'string')
      : [],
    microAddOns: {},
    selectedLargerAddOns: Array.isArray(config.selectedLargerAddOns)
      ? config.selectedLargerAddOns.filter((id) => typeof id === 'string')
      : [],
    deliverySpeed: config.deliverySpeed || 'standard',
  };

  // Validate micro add-on limits
  if (config.microAddOns && typeof config.microAddOns === 'object') {
    for (const [id, qty] of Object.entries(config.microAddOns)) {
      if (typeof qty === 'number' && qty > 0) {
        const option = MICRO_ADD_ON_OPTIONS.find((m) => m.id === id);
        if (option) {
          sanitizedConfig.microAddOns[id] = Math.min(option.maxQuantity || 5, Math.floor(qty));
        }
      }
    }
  }

  // Calculate authoritative estimate
  return calculateEstimate(sanitizedConfig);
}

export {
  calculateEstimate,
  PROJECT_TYPES,
  COMPLEXITY_CONFIG,
  MICRO_ADD_ON_OPTIONS,
  LARGER_ADD_ON_OPTIONS,
  formatINR,
};
