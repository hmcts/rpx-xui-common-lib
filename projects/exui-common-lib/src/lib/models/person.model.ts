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
  roleCategories: string[];
}

export enum PersonRole {
  JUDICIAL = 'Judicial',
  LEGAL_OPERATIONS = 'Legal Ops',
  ADMIN = 'Admin',
  CTSC = 'CTSC',
  ENFORCEMENT = 'Enforcement',
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
  ENFORCEMENT = 'ENFORCEMENT',
  ALL = 'ALL'
}

export function getRoleCategory(personRole: PersonRole): RoleCategory {

    let roleCategory = RoleCategory.ALL;
    if (!(personRole === PersonRole.ALL)) {
      if (personRole === PersonRole.LEGAL_OPERATIONS) {
        roleCategory = RoleCategory.LEGAL_OPERATIONS;
      } else if (personRole === PersonRole.ADMIN) {
        roleCategory = RoleCategory.ADMIN;
      } else if (personRole === PersonRole.CTSC) {
        roleCategory = RoleCategory.CTSC;
      }
    }
    return roleCategory;
}

export function getPersonRole(roleCategories: string[]): PersonRole {
    if (roleCategories.includes(RoleCategory.ADMIN)) {                                                                                                                                                                        
        return PersonRole.ADMIN;                                                                                                                                                                                                           
    }                                                                                                                                                                                                                                    
    if (roleCategories.includes(RoleCategory.CTSC)) {                                                                                                                                                                         
      return PersonRole.CTSC;                                                                                                                                                                                                            
    }                                                                                                                                                                                                                                    
    if (roleCategories.includes(RoleCategory.LEGAL_OPERATIONS)) {                                                                                                                                                             
      return PersonRole.LEGAL_OPERATIONS;                                                                                                                                                                                                
    }                                                                                                                                                                                                                                    
    // return default role if no match found                                                                                                                                                                                             
    return PersonRole.LEGAL_OPERATIONS;           
}  