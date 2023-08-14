export interface Person {
  id: string;
  name: string;
  email?: string;
  domain: string;
  knownAs?: string;
  fullName?: string;
}

export interface JudicialUserModel {
  title: string;
  knownAs: string;
  surname: string;
  fullName: string;
  initials: string;
  postNominals: string;
  emailId: string;
  personalCode: string;
  idamId: string;
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

export enum PersonRole {
  JUDICIAL = 'Judicial',
  CASEWORKER = 'Legal Ops',
  ADMIN = 'Admin',
  CTSC = 'CTSC',
  ALL = 'All',
}

// Note: RoleCategory could replace PersonRole possibly
// However a lot of webapp logic is based on current PersonRole understanding
export enum RoleCategory {
  JUDICIAL = 'JUDICIAL',
  CASEWORKER = 'LEGAL_OPERATIONS',
  ADMIN = 'ADMIN',
  CTSC = 'CTSC',
  ALL = 'ALL'
}
