// Project-local configuration. Add documentation roots/groups as your project grows.
export const site = { name: 'Engineering', mark: 'E', footer: 'Engineering standards' };
export const documentDirectories = ['.ai-rules'];
export const documentFiles = ['AGENTS.md'];
export const sections = [
  {
    id: 'ai',
    title: 'AI Rules',
    description: 'Task workflows and engineering rules',
    icon: 'ai',
    home: '.ai-rules/README.md',
    groups: [
      {
        title: 'Rule Entry',
        root: '.ai-rules',
        paths: ['.ai-rules/README.md', '.ai-rules/CATALOG.md'],
      },
      {
        title: 'Core Rules (Reusable)',
        root: '.ai-rules/core',
        exclude: [],
        pattern: /^\.ai-rules\/core\/(?!skills\/|agents\/)/,
      },
      { title: 'Skills', root: '.ai-rules/core/skills' },
      { title: 'Agent Roles', root: '.ai-rules/core/agents' },
      { title: 'Project Rules (Local)', root: '.ai-rules/project' },
      { title: 'Entry files', root: '.', paths: ['AGENTS.md'] },
    ],
  },
];
