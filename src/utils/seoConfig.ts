/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SeoConfig {
  brandName: string;
  alternateBrandNames: string[];
  founderName: string;
  founderRole: string;
  tagline: string;
  description: string;
  metaTitle: string;
  email: string;
  location: {
    region: string;
    city: string;
    country: string;
    areaServed: string[];
  };
  profiles: {
    portfolio: string;
    github: string;
    linkedin: string;
  };
  verifiedRepositories: Array<{
    name: string;
    fullName: string;
    url: string;
    description: string;
    category: string;
    technologies: string[];
  }>;
  baseUrl: string;
}

export const SEO_DATA: SeoConfig = {
  brandName: 'BUILD WITH HARI',
  alternateBrandNames: [
    'BuildWithHari',
    'Build By Hari',
    'Build With Hari Projects',
    'BuildWithHari Studio',
  ],
  founderName: 'Hari Nandan K.',
  founderRole: 'Independent Software Engineer & Founder',
  tagline: 'Your idea. Built properly.',
  description:
    'BUILD WITH HARI develops custom software, Python automation, data science, and AI projects for students & researchers. Direct 1-on-1 work with Hari Nandan K.',
  metaTitle: 'BUILD WITH HARI — Custom Software, Python & Student Project Development',
  email: 'harinandhan972@gmail.com',
  location: {
    region: 'Kerala',
    city: 'Kozhikode',
    country: 'IN',
    areaServed: ['India', 'Kerala', 'United States', 'United Kingdom', 'Worldwide'],
  },
  profiles: {
    portfolio: 'https://justinalexia.vercel.app/',
    github: 'https://github.com/Justin-io',
    linkedin: 'https://www.linkedin.com/in/justinalexia/',
  },
  verifiedRepositories: [
    {
      name: 'V.O.I.D.E',
      fullName: 'Justin-io/V.O.I.D.E',
      url: 'https://github.com/Justin-io/V.O.I.D.E',
      description:
        'Voice Operated Intelligent Digital Entity — Autonomous desktop voice interface and OS automation pipeline.',
      category: 'System Software & Automation',
      technologies: ['Python', 'SpeechRecognition', 'Pyttsx3', 'OS Automation'],
    },
    {
      name: 'Autonomous AI Data Scientist',
      fullName: 'Justin-io/autonomous-ai-data-scientist',
      url: 'https://github.com/Justin-io/autonomous-ai-data-scientist',
      description:
        'Automated tabular data science workbench with EDA, statistical testing, and multi-model benchmarking.',
      category: 'Data Science & Machine Learning',
      technologies: ['Python', 'Pandas', 'Scikit-Learn', 'XGBoost', 'EDA'],
    },
    {
      name: 'RAG Evaluation Platform',
      fullName: 'Justin-io/rag-eval-platform',
      url: 'https://github.com/Justin-io/rag-eval-platform',
      description:
        'Diagnostic benchmarking platform evaluating chunking strategies, vector embeddings, and RAG triad metrics.',
      category: 'Artificial Intelligence & LLMs',
      technologies: ['Vector Embeddings', 'RAG Triad', 'Cosine Similarity', 'FastAPI'],
    },
  ],
  baseUrl: 'https://ais-pre-udd7rt6ofdpfjny3x5oeis-330599699264.asia-east1.run.app',
};

/**
 * Resolves the canonical URL using environment or fallback
 */
export function getCanonicalUrl(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}${cleanPath === '/' ? '' : cleanPath}`;
  }
  return `${SEO_DATA.baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Generates the unified Schema.org JSON-LD graph uniting Brand, Founder, Services, and FAQs
 */
export function generateSchemaGraph(baseUrl = SEO_DATA.baseUrl): Record<string, unknown> {
  const orgId = `${baseUrl}/#organization`;
  const personId = `${baseUrl}/#hari`;
  const websiteId = `${baseUrl}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: baseUrl,
        name: SEO_DATA.brandName,
        alternateName: SEO_DATA.alternateBrandNames,
        description: SEO_DATA.description,
        publisher: { '@id': orgId },
        inLanguage: 'en-US',
      },
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': orgId,
        name: SEO_DATA.brandName,
        alternateName: SEO_DATA.alternateBrandNames,
        url: baseUrl,
        logo: `${baseUrl}/favicon.svg`,
        image: `${baseUrl}/og-image.svg`,
        description: SEO_DATA.description,
        founder: { '@id': personId },
        email: SEO_DATA.email,
        priceRange: '₹599 - ₹4,999+',
        address: {
          '@type': 'PostalAddress',
          addressRegion: SEO_DATA.location.region,
          addressLocality: SEO_DATA.location.city,
          addressCountry: SEO_DATA.location.country,
        },
        areaServed: SEO_DATA.location.areaServed.map((area) => ({
          '@type': 'AdministrativeArea',
          name: area,
        })),
        knowsAbout: [
          'Full-Stack Web Development',
          'Python Automation',
          'Exploratory Data Analysis',
          'Machine Learning Systems',
          'Retrieval-Augmented Generation',
          'Student Engineering Projects',
          'Academic Code Architecture',
        ],
        sameAs: [
          SEO_DATA.profiles.portfolio,
          SEO_DATA.profiles.github,
          SEO_DATA.profiles.linkedin,
        ],
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: SEO_DATA.founderName,
        jobTitle: SEO_DATA.founderRole,
        worksFor: { '@id': orgId },
        url: SEO_DATA.profiles.portfolio,
        sameAs: [
          SEO_DATA.profiles.portfolio,
          SEO_DATA.profiles.github,
          SEO_DATA.profiles.linkedin,
        ],
        knowsAbout: [
          'Software Engineering',
          'React & TypeScript',
          'Python Development',
          'Data Science',
          'Machine Learning & AI',
        ],
      },
      {
        '@type': 'Service',
        '@id': `${baseUrl}/#service-web`,
        name: 'Web & Applications Development',
        serviceType: 'Custom Web Application Development',
        provider: { '@id': orgId },
        description:
          'Responsive React and TypeScript applications, admin dashboards, student portals, and full-stack projects.',
        offers: {
          '@type': 'Offer',
          price: '699',
          priceCurrency: 'INR',
          description: 'Starting base scope for student web applications with clean source code.',
        },
      },
      {
        '@type': 'Service',
        '@id': `${baseUrl}/#service-python`,
        name: 'Python & Automation Engineering',
        serviceType: 'Python Scripting and Data Pipelines',
        provider: { '@id': orgId },
        description:
          'Custom automation utilities, web scrapers, data format converters, and modular command-line applications.',
        offers: {
          '@type': 'Offer',
          price: '599',
          priceCurrency: 'INR',
          description: 'Starting base price for Python utilities and automation scripts.',
        },
      },
      {
        '@type': 'Service',
        '@id': `${baseUrl}/#service-datascience`,
        name: 'Data Science & Statistical Analytics',
        serviceType: 'Data Analysis and Visual Insights',
        provider: { '@id': orgId },
        description:
          'Exploratory data analysis (EDA), hypothesis testing, dataset cleaning, and publication-ready charts in Jupyter notebooks.',
        offers: {
          '@type': 'Offer',
          price: '999',
          priceCurrency: 'INR',
          description: 'Starting base price for structured data science notebooks and charts.',
        },
      },
      {
        '@type': 'Service',
        '@id': `${baseUrl}/#service-ai`,
        name: 'AI & Intelligent Systems Development',
        serviceType: 'Machine Learning and RAG Architecture',
        provider: { '@id': orgId },
        description:
          'Custom machine learning models, benchmark evaluation, classification pipelines, and vector RAG applications.',
        offers: {
          '@type': 'Offer',
          price: '1299',
          priceCurrency: 'INR',
          description: 'Starting base price for machine learning and AI system implementations.',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is included in the project price at BUILD WITH HARI?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Every package includes the complete commented source code, requirements/dependency files, a comprehensive README with local setup instructions, demonstration screen recordings of the functioning application, and a standard revision window. Optional deliverables like PPT slides, viva preparation sheets, and report formatting are clearly itemized.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who actually writes the code for my project?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Hari Nandan K. personally develops every agreed project. There are no outsourced freelancers, third-party contractors, or unverified copy-pastes. You communicate directly 1-on-1 with the software engineer.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I get the full source code and rights?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, 100%. You receive the complete repository with all code files, assets, and configurations. You are free to run, modify, fork, or present the code for your academic submission.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can Hari explain the architecture for my viva or project defense?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. With the viva preparation add-on or briefing package, you receive a clear breakdown of key functions, architectural decisions, examiner questions, and algorithms used so you can defend your work with confidence.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does BUILD WITH HARI handle academic integrity?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'BUILD WITH HARI operates as an authentic engineering studio providing custom development, mentoring, and code tutoring. Students are provided with fully transparent code and documentation to ensure deep understanding, rather than exam evasion or ghostwriting.',
            },
          },
        ],
      },
    ],
  };
}
