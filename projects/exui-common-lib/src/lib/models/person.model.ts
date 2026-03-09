export interface Person {
  id: string;
  name: string;
  email?: string;
  domain: string;
  knownAs?: string;
  fullName?: string;
}

export interface JudicialUserModel {
  emailId: string;
  fullName: string;
  idamId: string;
  isJudge: string;
  isMagistrate: string;
  isPanelMember: string;
  knownAs: string;
  personalCode: string;
  surname: string;
  title: string;
}

export interface CaseworkersByService {
  service: string;
  caseworkers: Caseworker[];
}

export interface Caseworker {
  idamId: string;
  firstName: string;
  lastName: string;
  email: string;
  knownAs?: string;
  roleCategory: string;
}

// used as settings for filters and components
export enum PersonRole {
  JUDICIAL = 'Judicial',
  LEGAL_OPERATIONS = 'Legal Ops',
  ADMIN = 'Admin',
  CTSC = 'CTSC',
  ALL = 'All',
}

// Role categories used in application
export enum RoleCategory {
  JUDICIAL = 'JUDICIAL',
  LEGAL_OPERATIONS = 'LEGAL_OPERATIONS',
  ADMIN = 'ADMIN',
  CTSC = 'CTSC',
  PROFESSIONAL = 'PROFESSIONAL',
  CITIZEN = 'CITIZEN',
  // TODO(EXUI-2073): Decision needed for <NEW_CATEGORY> alignment with PersonRole.
  // QUESTION: Is <NEW_CATEGORY> backend-only (RoleCategory) or selectable in UI (PersonRole)?
  // CONTEXT: Existing RoleCategory values (e.g. PROFESSIONAL, CITIZEN) do not have explicit PersonRole branches.
  ALL = 'ALL'
}
