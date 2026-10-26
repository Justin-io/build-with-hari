/**
 * Centralized pricing configuration and calculation logic for BUILD WITH HARI.
 * All prices are in INR (₹).
 */

export type ProjectTypeId = 
  | 'web_app'
  | 'python_script'
  | 'data_science'
  | 'ai_ml'
  | 'custom_build'
  | 'micro_tweak';

export type ComplexityLevel = 'basic' | 'intermediate' | 'advanced';
export type DeliverySpeed = 'standard' | 'urgent' | 'express';

export interface ScopeOption {
  id: string;
  label: string;
  description: string;
  price: number;
}

export interface MicroAddOnOption {
  id: string;
  name: string;
  description: string;
  scopeLimit: string;
  price: number;
  unitLabel: string;
  maxQuantity: number;
  category: 'chart' | 'diagram' | 'design' | 'doc' | 'viva' | 'web';
}

export interface LargerAddOnOption {
  id: string;
  name: string;
  description: string;
  scopeLimit: string;
  price: number;
  isStartingFrom?: boolean;
}

export interface ProjectConfig {
  projectType: ProjectTypeId;
  complexity: ComplexityLevel;
  // Category-specific scope options
  webPagesCount?: number; // Base includes 1 page, each extra page +99
  selectedScopeFeatures: string[]; // ids of chosen features
  microAddOns: Record<string, number>; // id -> quantity
  selectedLargerAddOns: string[]; // ids of chosen larger add-ons
  // Legacy / fallback support for simple string arrays
  selectedAddOns?: string[];
  deliverySpeed: DeliverySpeed;
}

export interface ItemizedLine {
  label: string;
  detail?: string;
  amount: number;
  isIncludedFree?: boolean;
}

export interface EstimateResult {
  basePrice: number;
  complexityPrice: number;
  scopeFeaturesPrice: number;
  pagesPrice: number;
  microAddOnsPrice: number;
  largerAddOnsPrice: number;
  addOnsPrice: number; // total of micro + larger for backward compat
  subtotal: number;
  deliverySurchargeRate: number;
  deliverySurchargeAmount: number;
  totalINR: number;
  itemizedLines: ItemizedLine[];
  timelineDays: string;
  includedDeliverables: string[];
  notIncludedNotice: string[];
  isSubjectToScopeReview: boolean;
  scopeReviewReasons: string[];
}

export interface ProjectTypeMeta {
  id: ProjectTypeId;
  name: string;
  tagline: string;
  startingPrice: number;
  basePrice: number;
  description: string;
  scopeFeatures: ScopeOption[];
  isSubjectToReview?: boolean;
}

// 1. BASE PROJECT TYPES & PRICING
export const PROJECT_TYPES: Record<ProjectTypeId, ProjectTypeMeta> = {
  web_app: {
    id: 'web_app',
    name: 'Web & Applications',
    tagline: 'Modern responsive websites, dashboards, and client/fullstack apps',
    startingPrice: 699,
    basePrice: 699,
    description: 'Clean responsive frontends, portals, or full-stack web builds.',
    scopeFeatures: [
      { id: 'responsive', label: 'Mobile & Tablet Responsive', description: 'Fluid layout optimized for all device viewports', price: 0 },
      { id: 'contact_form', label: 'Interactive Forms & Validation', description: 'Client-side forms with inputs, feedback, and validation', price: 100 },
      { id: 'auth_scope', label: 'Basic User Authentication / Login', description: 'Session management, secure login/signup flows (from ₹299, subject to scope)', price: 299 },
      { id: 'database_scope', label: 'Database & CRUD Integration', description: 'Persistent data storage, models, and API wiring (from ₹299, subject to scope)', price: 299 },
      { id: 'dashboard_scope', label: 'Dashboard with Multiple Charts', description: 'Metric cards, data tables, and visualization views (from ₹149, subject to scope)', price: 149 },
    ],
  },
  python_script: {
    id: 'python_script',
    name: 'Python & Automation',
    tagline: 'Automation scripts, file handling, web scraping, and utilities',
    startingPrice: 599,
    basePrice: 599,
    description: 'Structured Python scripts, CLI tools, automated task runners, and utilities.',
    scopeFeatures: [
      { id: 'file_io', label: 'File I/O & Format Conversion', description: 'CSV, JSON, Excel, PDF ingestion and parsing', price: 150 },
      { id: 'web_scraping', label: 'Web Scraping / Data Extraction', description: 'Automated data extraction with BeautifulSoup/Playwright', price: 250 },
      { id: 'db_py', label: 'SQLite / SQL Database Wiring', description: 'Structured schema, persistent storage, and querying', price: 250 },
      { id: 'cli_gui', label: 'CLI Interface or Streamlit GUI', description: 'Interactive command-line flags or lightweight Streamlit dashboard', price: 250 },
    ],
  },
  data_science: {
    id: 'data_science',
    name: 'Data Science & Analytics',
    tagline: 'Exploratory analysis, statistical modeling, and visual insights',
    startingPrice: 999,
    basePrice: 999,
    description: 'Comprehensive exploratory data analysis, clean Jupyter notebooks, and publication-ready charts.',
    scopeFeatures: [
      { id: 'data_cleaning', label: 'Data Cleaning & Preprocessing', description: 'Outlier detection, missing value imputation, normalization', price: 150 },
      { id: 'visualizations', label: 'High-Impact Data Visualizations', description: 'Seaborn, Matplotlib, or Plotly charts with analytical annotations', price: 250 },
      { id: 'statistical_models', label: 'Statistical Tests & Hypothesis Testing', description: 'Correlations, regressions, ANOVA, and statistical significance', price: 300 },
      { id: 'interactive_plots', label: 'Interactive HTML Dashboards (Plotly)', description: 'Exportable interactive charts and exploratory drill-downs', price: 250 },
    ],
  },
  ai_ml: {
    id: 'ai_ml',
    name: 'AI & Intelligent Systems',
    tagline: 'Classification, prediction, NLP, LLM/RAG, and computer vision',
    startingPrice: 1299,
    basePrice: 1299,
    description: 'Trained ML models, evaluation metrics, confusion matrices, or LLM/RAG pipelines.',
    scopeFeatures: [
      { id: 'model_training', label: 'Model Training & Hyperparameter Tuning', description: 'Comparison of algorithms (RF, XGBoost, Neural Nets, etc.)', price: 350 },
      { id: 'evaluation_metrics', label: 'Rigorous Metrics & Confusion Matrix', description: 'Precision, Recall, F1, ROC-AUC curves, cross-validation', price: 200 },
      { id: 'rag_llm', label: 'RAG Pipeline or LLM Integration', description: 'Vector embeddings, chunking, retrieval, and prompt engineering', price: 450 },
      { id: 'api_deploy_ready', label: 'FastAPI / Flask Model Serving Endpoint', description: 'Lightweight REST API wrapper for real-time inference', price: 300 },
    ],
  },
  custom_build: {
    id: 'custom_build',
    name: 'Custom Build',
    tagline: 'Multi-technology systems, research prototypes, and hybrid architectures',
    startingPrice: 999,
    basePrice: 999,
    description: 'End-to-end bespoke software project, subject to scope confirmation.',
    isSubjectToReview: true,
    scopeFeatures: [
      { id: 'fullstack_custom', label: 'Full-Stack Architecture (Frontend + Backend)', description: 'Decoupled REST API + modern reactive frontend', price: 400 },
      { id: 'pipeline_custom', label: 'End-to-End Data / Model Processing Pipeline', description: 'Automated data ingestion to inference or visualization', price: 350 },
      { id: 'custom_dataset', label: 'Custom Dataset Curation & Validation', description: 'Domain-specific data gathering, schema validation, and tagging', price: 300 },
    ],
  },
  micro_tweak: {
    id: 'micro_tweak',
    name: 'Existing Project Micro-Tweak',
    tagline: 'Targeted additions or formatting fixes for an already working project',
    startingPrice: 10,
    basePrice: 0,
    description: 'Zero base build fee. Pay only for the specific micro-edits or tweaks you need.',
    scopeFeatures: [],
  },
};

// 2. ADDITIONAL WEB PAGE PRICE
export const ADDITIONAL_WEB_PAGE_PRICE = 99;

// 3. COMPLEXITY ADDITIONS
export const COMPLEXITY_CONFIG: Record<ComplexityLevel, { label: string; price: number; description: string }> = {
  basic: {
    label: 'Basic',
    price: 0,
    description: 'Standard single-purpose project, essential features, minimal dependencies.',
  },
  intermediate: {
    label: 'Intermediate',
    price: 400,
    description: 'Multiple components, database/file integration, clean modular structure, thorough documentation.',
  },
  advanced: {
    label: 'Advanced',
    price: 1000,
    description: 'Multi-service architecture, custom pipelines, comprehensive evaluation, production-grade styling.',
  },
};

// 4. ULTRA-LOW-COST MICRO ADD-ONS (₹10 – ₹99)
// Strictly for small adjustments to existing, working projects
export const MICRO_ADD_ON_OPTIONS: MicroAddOnOption[] = [
  {
    id: 'micro_chart',
    name: 'One simple chart added to an existing project',
    description: 'Single chart (bar, line, scatter) using Matplotlib, Seaborn, or Chart.js on clean data.',
    scopeLimit: '1 basic chart · Existing working code only',
    price: 10,
    unitLabel: 'chart',
    maxQuantity: 5,
    category: 'chart',
  },
  {
    id: 'micro_graph',
    name: 'One additional basic graph',
    description: 'One extra 2D comparison plot or visualization figure with clear labels and axes.',
    scopeLimit: '1 basic graph · Clean structured dataset',
    price: 10,
    unitLabel: 'graph',
    maxQuantity: 5,
    category: 'chart',
  },
  {
    id: 'micro_flowchart',
    name: 'Simple flowchart',
    description: 'Clean visual flowchart diagram illustrating program logic, algorithm, or user journey.',
    scopeLimit: 'Up to 6–8 process nodes · Vector/PNG export',
    price: 20,
    unitLabel: 'flowchart',
    maxQuantity: 3,
    category: 'diagram',
  },
  {
    id: 'micro_color',
    name: 'Basic colour customization',
    description: 'Theme/palette revision across UI components, chart colors, or presentation accent styles.',
    scopeLimit: 'Single project palette harmonization',
    price: 20,
    unitLabel: 'theme',
    maxQuantity: 1,
    category: 'design',
  },
  {
    id: 'micro_ppt_adjust',
    name: 'Minor PPT formatting adjustment',
    description: 'Typography alignment, margin cleanup, and visual consistency across existing slide deck.',
    scopeLimit: 'Formatting alignment on existing slides (up to 12 slides)',
    price: 20,
    unitLabel: 'deck',
    maxQuantity: 2,
    category: 'doc',
  },
  {
    id: 'micro_diagram',
    name: 'Simple diagram',
    description: 'Straightforward block diagram, system component layout, or data interaction diagram.',
    scopeLimit: '1 block/component diagram · Clean layout',
    price: 20,
    unitLabel: 'diagram',
    maxQuantity: 3,
    category: 'diagram',
  },
  {
    id: 'micro_viva_5',
    name: 'Five additional viva questions',
    description: 'Curated technical viva questions with model answers focused on your specific code implementation.',
    scopeLimit: '5 focused technical Q&As with rationale',
    price: 20,
    unitLabel: 'pack of 5',
    maxQuantity: 6, // up to 30 questions
    category: 'viva',
  },
  {
    id: 'micro_report_adjust',
    name: 'Minor report formatting adjustment',
    description: 'Heading hierarchy, margins, table-of-contents alignment, and typography pass on existing draft.',
    scopeLimit: 'Styling & alignment pass on existing document draft',
    price: 30,
    unitLabel: 'document',
    maxQuantity: 2,
    category: 'doc',
  },
  {
    id: 'micro_text_rev',
    name: 'Minor text/content revision',
    description: 'Polished technical copyediting or wording revisions across UI text, labels, or documentation.',
    scopeLimit: 'Up to ~250 words of targeted technical copyediting',
    price: 10,
    unitLabel: 'revision',
    maxQuantity: 5,
    category: 'doc',
  },
  {
    id: 'micro_web_page',
    name: 'Simple additional website page',
    description: 'One additional static or responsive content page integrated cleanly into your web project.',
    scopeLimit: '1 clean content/info page · Responsive design',
    price: 99,
    unitLabel: 'page',
    maxQuantity: 8,
    category: 'web',
  },
];

// 5. SUBSTANTIAL ACADEMIC & SYSTEM DELIVERABLES (LARGER ADD-ONS)
export const LARGER_ADD_ON_OPTIONS: LargerAddOnOption[] = [
  {
    id: 'larger_ppt',
    name: 'PPT up to 8–10 slides',
    description: 'Full academic presentation with problem statement, system architecture, methodology, and results.',
    scopeLimit: 'Complete slide deck (8–10 slides) · PPTX & PDF',
    price: 299,
  },
  {
    id: 'larger_report',
    name: 'Report formatting within a defined page limit',
    description: 'Complete academic project documentation formatting (IEEE or standard college format) with index & citations.',
    scopeLimit: 'Academic report layout (up to 25 pages) · Word & PDF',
    price: 199,
  },
  {
    id: 'larger_db',
    name: 'Basic database integration',
    description: 'Structured database schema (SQLite/PostgreSQL), connection setup, models, and CRUD operations.',
    scopeLimit: 'from ₹299, subject to scope (schema & entity count)',
    price: 299,
    isStartingFrom: true,
  },
  {
    id: 'larger_auth',
    name: 'Authentication/login',
    description: 'Secure user login, registration, password hashing, and session/token authorization flow.',
    scopeLimit: 'from ₹299, subject to scope (JWT/session/OAuth)',
    price: 299,
    isStartingFrom: true,
  },
  {
    id: 'larger_dashboard',
    name: 'Dashboard with multiple charts',
    description: 'Comprehensive analytics view featuring multiple synced charts, KPI metric cards, and responsive data grid.',
    scopeLimit: 'from ₹149, subject to scope (chart count & data sources)',
    price: 149,
    isStartingFrom: true,
  },
  {
    id: 'larger_deploy',
    name: 'Basic deployment assistance',
    description: 'End-to-end guidance deploying your project to Vercel, Render, or GitHub Pages with environment setup.',
    scopeLimit: '1 deployment target + step-by-step setup walkthrough',
    price: 199,
  },
];

// Combined add-on list for backward compatibility
export const ADD_ON_OPTIONS = [
  ...LARGER_ADD_ON_OPTIONS,
  ...MICRO_ADD_ON_OPTIONS.map((m) => ({
    id: m.id,
    name: m.name,
    description: m.description,
    limit: m.scopeLimit,
    price: m.price,
  })),
];

// 6. DELIVERY OPTIONS
export const DELIVERY_OPTIONS: Record<DeliverySpeed, { label: string; surchargeRate: number; timeline: string; note: string }> = {
  standard: {
    label: 'Standard Delivery',
    surchargeRate: 0,
    timeline: '5–7 business days',
    note: 'Thorough build, testing, and clean documentation.',
  },
  urgent: {
    label: 'Urgent Delivery',
    surchargeRate: 0.30,
    timeline: '3–4 business days',
    note: 'Priority queue (+30% surcharge, subject to schedule availability).',
  },
  express: {
    label: 'Express Delivery',
    surchargeRate: 0.50,
    timeline: '24–48 hours',
    note: 'Immediate turnaround (+50% surcharge, confirmed after scope review).',
  },
};

/**
 * Pure calculation function for project price estimate
 */
export function calculateEstimate(config: ProjectConfig): EstimateResult {
  const projectMeta = PROJECT_TYPES[config.projectType] || PROJECT_TYPES.web_app;
  const basePrice = projectMeta.basePrice;
  const complexityMeta = COMPLEXITY_CONFIG[config.complexity] || COMPLEXITY_CONFIG.basic;
  const complexityPrice = config.projectType === 'micro_tweak' ? 0 : complexityMeta.price;

  const itemizedLines: ItemizedLine[] = [];

  if (basePrice > 0) {
    itemizedLines.push({
      label: `${projectMeta.name} (Base Build)`,
      detail: projectMeta.isSubjectToReview ? 'Starting base · Subject to scope confirmation' : 'Standard core build package',
      amount: basePrice,
    });
  }

  if (complexityPrice > 0) {
    itemizedLines.push({
      label: `Complexity: ${complexityMeta.label}`,
      detail: complexityMeta.description,
      amount: complexityPrice,
    });
  }

  // Web pages calculation (only for web_app)
  let pagesPrice = 0;
  if (config.projectType === 'web_app' && config.webPagesCount && config.webPagesCount > 1) {
    const extraPages = config.webPagesCount - 1;
    pagesPrice = extraPages * ADDITIONAL_WEB_PAGE_PRICE;
    itemizedLines.push({
      label: `Additional Web Pages (${extraPages} extra)`,
      detail: `${config.webPagesCount} total pages @ ₹${ADDITIONAL_WEB_PAGE_PRICE}/extra page`,
      amount: pagesPrice,
    });
  }

  // Category specific scope features
  let scopeFeaturesPrice = 0;
  const validFeatureIds = new Set(projectMeta.scopeFeatures.map((f) => f.id));
  const activeFeatures = config.selectedScopeFeatures || [];
  for (const featureId of activeFeatures) {
    if (validFeatureIds.has(featureId)) {
      const feature = projectMeta.scopeFeatures.find((f) => f.id === featureId);
      if (feature && feature.price > 0) {
        scopeFeaturesPrice += feature.price;
        itemizedLines.push({
          label: feature.label,
          detail: feature.description,
          amount: feature.price,
        });
      }
    }
  }

  // Scope deduplication checks (Rule 5: Do not charge twice for chart/diagram already included)
  const largerAddOnSet = new Set(config.selectedLargerAddOns || []);
  // Legacy selectedAddOns compatibility
  if (config.selectedAddOns) {
    for (const id of config.selectedAddOns) {
      if (LARGER_ADD_ON_OPTIONS.some((o) => o.id === id)) {
        largerAddOnSet.add(id);
      }
    }
  }

  const hasDashboardSelected = 
    largerAddOnSet.has('larger_dashboard') || 
    activeFeatures.includes('dashboard_scope') || 
    activeFeatures.includes('dashboard');

  const hasVisualizationsSelected = 
    config.projectType === 'data_science' && activeFeatures.includes('visualizations');

  const hasPresentationOrDiagrams = 
    largerAddOnSet.has('larger_ppt');

  // Calculate Larger Add-ons
  let largerAddOnsPrice = 0;
  const scopeReviewReasons: string[] = [];

  if (projectMeta.isSubjectToReview) {
    scopeReviewReasons.push('Custom Build: Final quotation confirmed after syllabus and requirement review.');
  }

  for (const addOnId of largerAddOnSet) {
    const largerOption = LARGER_ADD_ON_OPTIONS.find((a) => a.id === addOnId);
    if (largerOption) {
      largerAddOnsPrice += largerOption.price;
      itemizedLines.push({
        label: largerOption.name,
        detail: largerOption.scopeLimit,
        amount: largerOption.price,
      });

      if (largerOption.isStartingFrom) {
        scopeReviewReasons.push(`${largerOption.name}: Indicative starting price; exact quote confirmed based on schema/endpoints.`);
      }
    }
  }

  // Calculate Micro Add-ons with deduplication check
  let microAddOnsPrice = 0;
  const microQuantities = config.microAddOns || {};

  // Also check legacy selectedAddOns for micro items
  if (config.selectedAddOns) {
    for (const id of config.selectedAddOns) {
      if (MICRO_ADD_ON_OPTIONS.some((m) => m.id === id) && !microQuantities[id]) {
        microQuantities[id] = 1;
      }
    }
  }

  let waivedChartsCount = 0;
  let waivedDiagramsCount = 0;

  for (const [microId, qty] of Object.entries(microQuantities)) {
    if (qty <= 0) continue;
    const microOption = MICRO_ADD_ON_OPTIONS.find((m) => m.id === microId);
    if (!microOption) continue;

    // Deduplication Rule:
    // If a dashboard or data science visualization package is active, the first basic chart/graph is already covered!
    if ((microId === 'micro_chart' || microId === 'micro_graph') && (hasDashboardSelected || hasVisualizationsSelected) && waivedChartsCount === 0) {
      waivedChartsCount++;
      const chargeableQty = qty - 1;
      const chargeablePrice = chargeableQty * microOption.price;
      microAddOnsPrice += chargeablePrice;

      if (chargeableQty === 0) {
        itemizedLines.push({
          label: `${microOption.name} (${qty}x)`,
          detail: hasDashboardSelected ? 'Covered in selected Dashboard with multiple charts (₹0)' : 'Covered in Data Science visualizations scope (₹0)',
          amount: 0,
          isIncludedFree: true,
        });
      } else {
        itemizedLines.push({
          label: `${microOption.name} (${qty}x)`,
          detail: `1 covered in Dashboard/Data Science package · ${chargeableQty} chargeable @ ₹${microOption.price}`,
          amount: chargeablePrice,
        });
      }
      continue;
    }

    // If presentation already selected, first simple diagram / flowchart is flagged
    if ((microId === 'micro_diagram' || microId === 'micro_flowchart') && hasPresentationOrDiagrams && waivedDiagramsCount === 0) {
      waivedDiagramsCount++;
      const chargeableQty = qty - 1;
      const chargeablePrice = chargeableQty * microOption.price;
      microAddOnsPrice += chargeablePrice;

      if (chargeableQty === 0) {
        itemizedLines.push({
          label: `${microOption.name} (${qty}x)`,
          detail: 'Covered in PPT slide deck diagrams (₹0)',
          amount: 0,
          isIncludedFree: true,
        });
      } else {
        itemizedLines.push({
          label: `${microOption.name} (${qty}x)`,
          detail: `1 covered in PPT · ${chargeableQty} chargeable @ ₹${microOption.price}`,
          amount: chargeablePrice,
        });
      }
      continue;
    }

    // Standard micro add-on line
    const lineAmount = qty * microOption.price;
    microAddOnsPrice += lineAmount;
    itemizedLines.push({
      label: qty > 1 ? `${microOption.name} (${qty}x)` : microOption.name,
      detail: `${microOption.scopeLimit} · ${qty} × ₹${microOption.price}`,
      amount: lineAmount,
    });
  }

  const addOnsPrice = microAddOnsPrice + largerAddOnsPrice;
  const subtotal = basePrice + complexityPrice + pagesPrice + scopeFeaturesPrice + addOnsPrice;

  // Delivery surcharge
  const delivery = DELIVERY_OPTIONS[config.deliverySpeed] || DELIVERY_OPTIONS.standard;
  const deliverySurchargeRate = delivery.surchargeRate;
  const deliverySurchargeAmount = Math.round(subtotal * deliverySurchargeRate);

  if (deliverySurchargeAmount > 0) {
    itemizedLines.push({
      label: `${delivery.label} (+${Math.round(deliverySurchargeRate * 100)}%)`,
      detail: delivery.timeline,
      amount: deliverySurchargeAmount,
    });
  }

  const totalINR = subtotal + deliverySurchargeAmount;

  // Deliverables included
  const includedDeliverables = [
    'Complete, structured source code repository (clean & commented)',
    'README with local setup instructions and requirements.txt / package.json',
    'Working demonstration / screen capture verification',
    'Standard revision period for minor scope fixes',
  ];

  if (largerAddOnSet.has('larger_ppt')) {
    includedDeliverables.push('Project presentation slides (8–10 structured slides)');
  }
  if (largerAddOnSet.has('larger_report')) {
    includedDeliverables.push('Academic project documentation (IEEE / college format layout)');
  }
  if (largerAddOnSet.has('larger_db')) {
    includedDeliverables.push('Database schema, models & CRUD integration');
  }
  if (largerAddOnSet.has('larger_auth')) {
    includedDeliverables.push('Authentication & secure session / JWT management');
  }
  if (largerAddOnSet.has('larger_dashboard')) {
    includedDeliverables.push('Dashboard with multiple charts & analytical views');
  }
  if (largerAddOnSet.has('larger_deploy')) {
    includedDeliverables.push('Guided deployment to Vercel/Render/hosting target');
  }

  const notIncludedNotice = [
    'No guaranteed academic grades or plagiarism clearance guarantees',
    'Major post-delivery scope changes outside the agreed requirements',
    'Purchased third-party API credits (OpenAI/AWS keys must be provided by user)',
    'Micro-add-ons (₹10–₹30) are limited strictly to minor adjustments on existing/working code',
  ];

  const isSubjectToScopeReview = scopeReviewReasons.length > 0 || config.complexity === 'advanced';

  return {
    basePrice,
    complexityPrice,
    scopeFeaturesPrice,
    pagesPrice,
    microAddOnsPrice,
    largerAddOnsPrice,
    addOnsPrice,
    subtotal,
    deliverySurchargeRate,
    deliverySurchargeAmount,
    totalINR,
    itemizedLines,
    timelineDays: delivery.timeline,
    includedDeliverables,
    notIncludedNotice,
    isSubjectToScopeReview,
    scopeReviewReasons,
  };
}

/**
 * Format an integer or float into Indian Rupee representation (e.g. ₹1,299)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
