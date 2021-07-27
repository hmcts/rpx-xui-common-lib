export interface Person {
  id: string;
  name: string;
  email: string;
  domain: string;
}

export enum PersonDomain {
  JUDICIAL = 1,
  CASEWORKER = 2,
  BOTH = 3
}
