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

export function getRoleCategoryTitle(roleCategory: RoleCategory): string {
  switch (roleCategory) {
    case RoleCategory.LEGAL_OPERATIONS: {
      return 'legal Ops';
    }
    case RoleCategory.JUDICIAL: {
      return 'judicial';
    }
    case RoleCategory.ADMIN: {
      return 'admin';
    }
    case RoleCategory.CTSC: {
      return 'CTSC';
    }
    case RoleCategory.ENFORCEMENT: {
      return 'enforcement';
    }
    default:
      return 'legal Ops';
  }
}

export function getRoleCategoryForWorkAllocation(personRole: PersonRole): RoleCategory | null{
  if (personRole === PersonRole.JUDICIAL) {
    return RoleCategory.JUDICIAL;
  } else if (personRole === PersonRole.LEGAL_OPERATIONS) {
    return RoleCategory.LEGAL_OPERATIONS;
  } else if (personRole === PersonRole.ADMIN) {
    return RoleCategory.ADMIN;
  } else if (personRole === PersonRole.CTSC) {
    return RoleCategory.CTSC;
  } else if (personRole === PersonRole.ENFORCEMENT) {
    return RoleCategory.ENFORCEMENT;
  }
  return null;
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
    } else if (personRole === PersonRole.ENFORCEMENT) {
      roleCategory = RoleCategory.ENFORCEMENT;
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
  if (roleCategories.includes(RoleCategory.ENFORCEMENT)) {
    return PersonRole.ENFORCEMENT;
  } 
  // return default role if no match found                                                                                                                                                                                             
  return PersonRole.LEGAL_OPERATIONS;           
}  

export function getPersonRoleForAllocateRole(roleCategory: RoleCategory): PersonRole | null {
  if (roleCategory === RoleCategory.LEGAL_OPERATIONS) {
    return PersonRole.LEGAL_OPERATIONS;
  } else if (roleCategory === RoleCategory.ADMIN) {
    return PersonRole.ADMIN;
  } else if (roleCategory === RoleCategory.CTSC) {
    return PersonRole.CTSC;
  } else if (roleCategory === RoleCategory.ENFORCEMENT) {
    return PersonRole.ENFORCEMENT;
  } 
  return null;
}
   
export function getPersonRoleForTaskAssignment(roleCategory: RoleCategory): PersonRole {
  if (roleCategory === RoleCategory.JUDICIAL) {
    return PersonRole.JUDICIAL;
  } else if (roleCategory === RoleCategory.LEGAL_OPERATIONS) {
    return PersonRole.LEGAL_OPERATIONS;
  } else if (roleCategory === RoleCategory.ADMIN) {
    return PersonRole.ADMIN;
  } else if (roleCategory === RoleCategory.ENFORCEMENT) {
    return PersonRole.ENFORCEMENT;
  }
  return PersonRole.ALL;
}

export function getPersonRoleForWorkAllocation(roleCategory: RoleCategory): PersonRole {
  switch (roleCategory) {
    case RoleCategory.ADMIN:
      return PersonRole.ADMIN;
    case RoleCategory.JUDICIAL:
      return PersonRole.JUDICIAL;
    case RoleCategory.LEGAL_OPERATIONS:
      return PersonRole.LEGAL_OPERATIONS;
    case RoleCategory.CTSC:
      return PersonRole.CTSC;
    case RoleCategory.ENFORCEMENT:
      return PersonRole.ENFORCEMENT;
    default:
      throw new Error(`Invalid roleCategory ${roleCategory}`);
  }
}

    
