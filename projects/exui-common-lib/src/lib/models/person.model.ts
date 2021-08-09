export interface Person {
  id: string;
  name: string;
  email: string;
  domain: string;
}

export enum PersonRole {
  JUDICIAL = 'Judicial',
  CASEWORKER = 'Legal Ops',
  ADMIN = 'Admin',
  ALL = 'All',
}
