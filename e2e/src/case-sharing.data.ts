import { SharedCase } from '../../projects/exui-common-lib/src/lib/models/case-share.model';

// Hand-written expectations are independent of the demo's seed and the real state service.
export const expectedSharedCases: SharedCase[] = [
  {
    caseId: 'DEMO-001', caseTitle: 'Synthetic case Alpha',
    sharedWith: [{ idamId: 'demo-alex', firstName: 'Alex', lastName: 'Taylor', email: 'alex@example.test' }],
    pendingShares: [{ idamId: 'demo-sam', firstName: 'Sam', lastName: 'Morgan', email: 'sam@example.test' }],
    pendingUnshares: []
  },
  {
    caseId: 'DEMO-002', caseTitle: 'Synthetic case Beta',
    sharedWith: [{ idamId: 'demo-alex', firstName: 'Alex', lastName: 'Taylor', email: 'alex@example.test' }],
    pendingShares: [{ idamId: 'demo-sam', firstName: 'Sam', lastName: 'Morgan', email: 'sam@example.test' }],
    pendingUnshares: []
  }
];

export const expectedDeselectedCases: SharedCase[] = [
  {
    caseId: 'DEMO-001', caseTitle: 'Synthetic case Alpha',
    sharedWith: [{ idamId: 'demo-alex', firstName: 'Alex', lastName: 'Taylor', email: 'alex@example.test' }],
    pendingShares: [], pendingUnshares: []
  }
];
