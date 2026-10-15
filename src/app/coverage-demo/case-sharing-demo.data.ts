import { SharedCase, UserDetails } from 'projects/exui-common-lib/src/lib/models';

export const sharingUsers: UserDetails[] = [
  { idamId: 'demo-alex', firstName: 'Alex', lastName: 'Taylor', email: 'alex@example.test' },
  { idamId: 'demo-sam', firstName: 'Sam', lastName: 'Morgan', email: 'sam@example.test' }
];

export function sharingCases(): SharedCase[] {
  return [
    { caseId: 'DEMO-001', caseTitle: 'Synthetic case Alpha', sharedWith: [sharingUsers[0]], pendingShares: [], pendingUnshares: [] },
    { caseId: 'DEMO-002', caseTitle: 'Synthetic case Beta', sharedWith: [sharingUsers[0]], pendingShares: [], pendingUnshares: [] }
  ];
}
