import type { Caseworker, JudicialUserModel, Person } from 'projects/exui-common-lib/src/public-api';

export const judicialPeople: Person[] = [
  {
    id: 'demo-judge',
    name: 'Alex Taylor',
    fullName: 'Judge Alex Taylor',
    email: 'alex@example.test',
    domain: 'Judicial'
  },
  {
    id: 'demo-selected',
    name: 'Alex Selected',
    fullName: 'Judge Alex Selected',
    email: 'selected@example.test',
    domain: 'Judicial'
  },
  {
    id: 'demo-assigned',
    name: 'Alex Assigned',
    fullName: 'Judge Alex Assigned',
    email: 'assigned@example.test',
    domain: 'Judicial'
  }
];

export const caseworkers: Caseworker[] = [
  {
    idamId: 'demo-legal',
    firstName: 'Alex',
    lastName: 'Legal',
    email: 'legal@example.test',
    roleCategories: ['LEGAL_OPERATIONS']
  },
  {
    idamId: 'demo-admin',
    firstName: 'Alex',
    lastName: 'Admin',
    email: 'admin@example.test',
    roleCategories: ['ADMIN']
  },
  {
    idamId: 'demo-ctsc',
    firstName: 'Alex',
    lastName: 'CTSC',
    email: 'ctsc@example.test',
    roleCategories: ['CTSC']
  },
  {
    idamId: 'demo-assigned',
    firstName: 'Alex',
    lastName: 'Assigned',
    email: 'assigned@example.test',
    roleCategories: ['LEGAL_OPERATIONS']
  }
];

export const judicialUsers: JudicialUserModel[] = [
  {
    idamId: 'demo-judge',
    fullName: 'Judge Alex Taylor',
    emailId: 'alex@example.test',
    isJudge: 'Y',
    isMagistrate: 'N',
    isPanelMember: 'N',
    knownAs: 'Alex',
    personalCode: 'demo-code',
    surname: 'Taylor',
    title: 'Judge'
  },
  {
    idamId: 'demo-selected',
    fullName: 'Judge Alex Selected',
    emailId: 'selected@example.test',
    isJudge: 'Y',
    isMagistrate: 'N',
    isPanelMember: 'N',
    knownAs: 'Alex',
    personalCode: 'demo-selected-code',
    surname: 'Selected',
    title: 'Judge'
  }
];
