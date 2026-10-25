// Project-owned documentation roots and branding. Replace when adopting.
export const site = { name: 'Debtflow', mark: 'D', footer: 'Debtflow engineering standards' };
export const documentDirectories = [
  '.ai-rules',
  'docs/getting-started',
  'docs/architecture',
  'docs/engineering',
  'docs/ai-guide',
  'apps/shell/.ai-rules',
  'apps/partner-ops/.ai-rules',
  'apps/payments/.ai-rules',
];
export const documentFiles = [
  'docs/README.md',
  'tooling/rules-viewer/README.md',
  'AGENTS.md',
  'apps/shell/AGENTS.md',
  'apps/partner-ops/AGENTS.md',
  'apps/payments/AGENTS.md',
];
const appRules = ['shell', 'partner-ops', 'payments'];
export const sections = [
  {
    id: 'start',
    title: 'Getting Started',
    description: 'Setup and team onboarding',
    icon: 'start',
    home: 'docs/getting-started/README.md',
    groups: [
      { title: 'Getting Started', root: 'docs/getting-started' },
      { title: 'Documentation Map', root: 'docs', paths: ['docs/README.md'] },
    ],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    description: 'Apps, packages and ownership',
    icon: 'architecture',
    home: 'docs/architecture/README.md',
    groups: [
      { title: 'Architecture', root: 'docs/architecture' },
      {
        title: 'App ownership',
        root: 'apps',
        paths: appRules.map((app) => `apps/${app}/.ai-rules/architecture.md`),
      },
    ],
  },
  {
    id: 'standards',
    title: 'Engineering',
    description: 'Code conventions by responsibility',
    icon: 'standards',
    home: 'docs/engineering/README.md',
    groups: [
      { title: 'Engineering', root: 'docs/engineering' },
      {
        title: 'Documentation tooling',
        root: 'tooling/rules-viewer',
        paths: ['tooling/rules-viewer/README.md'],
      },
      { title: 'Core Standards', root: '.ai-rules/core/standards' },
      { title: 'Core Frameworks', root: '.ai-rules/core/frameworks' },
      { title: 'Core Concerns', root: '.ai-rules/core/concerns' },
      {
        title: 'App standards',
        root: 'apps',
        pattern: /^apps\/(shell|partner-ops|payments)\/\.ai-rules\//,
        exclude: appRules.map((app) => `apps/${app}/.ai-rules/architecture.md`),
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI Guide',
    description: 'Prompts, project context and results',
    icon: 'ai',
    home: 'docs/ai-guide/README.md',
    groups: [
      {
        title: 'AI Guide',
        root: 'docs/ai-guide',
        order: [
          'project-context',
          'prompts',
          'how-ai-works',
          'result-review',
          'rule-reference',
          'evaluation',
        ],
      },
      {
        title: 'Rule Entry',
        root: '.ai-rules',
        paths: ['.ai-rules/README.md', '.ai-rules/CATALOG.md'],
      },
      {
        title: 'Core Rules (Reusable)',
        root: '.ai-rules/core',
        pattern: /^\.ai-rules\/core\/(README\.md$|execution\/|workflows\/)/,
      },
      { title: 'Skills', root: '.ai-rules/core/skills' },
      { title: 'Agent Roles', root: '.ai-rules/core/agents' },
      { title: 'Project Rules (Local)', root: '.ai-rules/project' },
      {
        title: 'Entry files',
        root: '.',
        paths: ['AGENTS.md', ...appRules.map((app) => `apps/${app}/AGENTS.md`)],
      },
    ],
  },
];
