export interface Person {
  id: string;
  name: string;
  email?: string;
  domain: string;
  knownAs?: string;
}

export interface JudicialUserModel {
  sidam_id: string;
  object_id: string;
  known_as: string;
  surname: string;
  personal_code: string;
  full_name: string;
  post_nominals: string;
  email_id: string;
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
  ALL = 'All',
}

// Note: RoleCategory could replace PersonRole possibly
// However a lot of webapp logic is based on current PersonRole understanding
export enum RoleCategory {
  JUDICIAL = 'JUDICIAL',
  CASEWORKER = 'LEGAL_OPERATIONS',
  ADMIN = 'ADMIN',
  ALL = 'ALL'
}
