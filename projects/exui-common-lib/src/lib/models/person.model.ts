export interface Person {
  id: string;
  name: string;
  email?: string;
  domain: string;
  knownAs?: string;
}

export interface Caseworker {
  idamId: string;
  firstName: string;
  lastName: string;
  email: string;
  knownAs?: string;
}

export enum PersonRole {
  JUDICIAL = 'Judicial',
  CASEWORKER = 'Legal Ops',
  ADMIN = 'Admin',
  ALL = 'All',
}
