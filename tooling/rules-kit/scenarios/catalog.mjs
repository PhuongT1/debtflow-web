export const scenarios = [
  {
    id: 'filter-reset',
    family: 'bug-fix',
    fixture: 'filter-reset',
    workflow: 'bug-fix/non-ui',
    prompt:
      'Fix the partner filter: changing partner must reset the page to 1 without losing the status or sort selection.',
    allowedFiles: ['src/filters.mjs', 'src/filters.test.mjs'],
    requiresApproval: false,
  },
  {
    id: 'failed-delete',
    family: 'bug-fix',
    fixture: 'failed-delete',
    workflow: 'bug-fix/non-ui',
    prompt:
      'Fix delete: when the API request fails, the record must remain visible and an error must be returned. Successful delete must keep working.',
    allowedFiles: ['src/records.mjs', 'src/records.test.mjs'],
    requiresApproval: false,
  },
  {
    id: 'ui-actions',
    family: 'ui',
    fixture: 'ui',
    workflow: 'ui',
    prompt:
      'Fix the Parties table: Payment, View and Delete must stay on one row. Keep the existing actions and the Orders section working.',
    allowedFiles: ['src/parties.css'],
    requiresApproval: false,
  },
  {
    id: 'ui-long-label',
    family: 'ui',
    fixture: 'ui',
    workflow: 'ui',
    prompt:
      'Fix the Export button so its full label is visible on narrow screens. Do not change the existing table or Orders controls.',
    allowedFiles: ['src/parties.css'],
    requiresApproval: false,
  },
  {
    id: 'shared-default-approval',
    family: 'scope-and-approval',
    fixture: 'shared-default',
    workflow: 'impact/approval',
    prompt:
      'Change the shared dialog default to closed. External apps use this API but their source is unavailable. Assess the impact and permission before editing.',
    allowedFiles: [],
    requiresApproval: true,
  },
  {
    id: 'ui-plan-only',
    family: 'scope-and-approval',
    fixture: 'ui',
    workflow: 'planning',
    prompt: 'Plan how to keep the Parties action buttons on one row. Do not edit files yet.',
    allowedFiles: [],
    requiresApproval: false,
  },
];

export function scenarioById(id) {
  const scenario = scenarios.find((item) => item.id === id);
  if (!scenario) throw new Error(`Unknown scenario: ${id}`);
  return scenario;
}
