import { getPersonRole, getPersonRoleForAllocateRole, getPersonRoleForTaskAssignment, getPersonRoleForWorkAllocation, getRoleCategory, getRoleCategoryForWorkAllocation, getRoleCategoryTitle, PersonRole, RoleCategory } from './person.model';

describe('PersonModel', () => {

  it('should return the role category title', () => {
    expect(getRoleCategoryTitle(RoleCategory.LEGAL_OPERATIONS)).toBe('legal Ops');
    expect(getRoleCategoryTitle(RoleCategory.CTSC)).toBe('CTSC');
    expect(getRoleCategoryTitle(RoleCategory.JUDICIAL)).toBe('judicial');
    expect(getRoleCategoryTitle(RoleCategory.ADMIN)).toBe('admin');
    expect(getRoleCategoryTitle(RoleCategory.ENFORCEMENT)).toBe('enforcement');
  });

  it('should return the role category for a person role', () => {
    expect(getRoleCategory(PersonRole.ALL)).toBe(RoleCategory.ALL);
    expect(getRoleCategory(PersonRole.LEGAL_OPERATIONS)).toBe(RoleCategory.LEGAL_OPERATIONS);
    expect(getRoleCategory(PersonRole.ADMIN)).toBe(RoleCategory.ADMIN);
    expect(getRoleCategory(PersonRole.CTSC)).toBe(RoleCategory.CTSC);
    expect(getRoleCategory(PersonRole.JUDICIAL)).toBe(RoleCategory.ALL);
    expect(getRoleCategory(PersonRole.ENFORCEMENT)).toBe(RoleCategory.ENFORCEMENT);
  });
  
  it('should return the role category for a person role for work allocation', () => {
    expect(getRoleCategoryForWorkAllocation(PersonRole.JUDICIAL)).toEqual(RoleCategory.JUDICIAL);
    expect(getRoleCategoryForWorkAllocation(PersonRole.LEGAL_OPERATIONS)).toEqual(RoleCategory.LEGAL_OPERATIONS);
    expect(getRoleCategoryForWorkAllocation(PersonRole.ADMIN)).toEqual(RoleCategory.ADMIN);
    expect(getRoleCategoryForWorkAllocation(PersonRole.CTSC)).toEqual(RoleCategory.CTSC);
    expect(getRoleCategoryForWorkAllocation(PersonRole.ENFORCEMENT)).toEqual(RoleCategory.ENFORCEMENT);
    expect(getRoleCategoryForWorkAllocation('Missing Role' as PersonRole)).toBeNull();
  });

  it('should return the person role for a set of role categories', () => {
    expect(getPersonRole(['UNKNOWN'])).toBe(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRole([RoleCategory.JUDICIAL])).toBe(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRole([RoleCategory.PROFESSIONAL])).toBe(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRole([RoleCategory.CITIZEN])).toBe(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRole([RoleCategory.ENFORCEMENT])).toBe(PersonRole.ENFORCEMENT);
    expect(getPersonRole([RoleCategory.ENFORCEMENT, RoleCategory.LEGAL_OPERATIONS])).toBe(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRole([RoleCategory.ENFORCEMENT, RoleCategory.LEGAL_OPERATIONS, RoleCategory.CTSC])).toBe(PersonRole.CTSC);
    expect(getPersonRole([RoleCategory.ENFORCEMENT, RoleCategory.LEGAL_OPERATIONS, RoleCategory.CTSC, RoleCategory.ADMIN])).toBe(PersonRole.ADMIN);
  });

  it('should return the person role for work allocation', () => {
    let label = getPersonRoleForWorkAllocation(RoleCategory.LEGAL_OPERATIONS);
    expect(label).toEqual('Legal Ops');

    label = getPersonRoleForWorkAllocation(RoleCategory.ADMIN);
    expect(label).toEqual('Admin');

    label = getPersonRoleForWorkAllocation(RoleCategory.JUDICIAL);
    expect(label).toEqual('Judicial');

    expect(getPersonRoleForWorkAllocation(RoleCategory.CTSC)).toEqual('CTSC');
    expect(getPersonRoleForWorkAllocation(RoleCategory.ENFORCEMENT)).toEqual('Enforcement');

    try {
      getPersonRoleForWorkAllocation('some' as RoleCategory);
    } catch (error) {
      expect(error.message).toContain('Invalid roleCategory');
    }
  });

  it('should return the person role for Allocate Role', () => {
    expect(getPersonRoleForAllocateRole(RoleCategory.LEGAL_OPERATIONS)).toEqual(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRoleForAllocateRole(RoleCategory.ADMIN)).toEqual(PersonRole.ADMIN);
    expect(getPersonRoleForAllocateRole(RoleCategory.CTSC)).toEqual(PersonRole.CTSC);
    expect(getPersonRoleForAllocateRole(RoleCategory.ENFORCEMENT)).toEqual(PersonRole.ENFORCEMENT);
    expect(getPersonRoleForAllocateRole(RoleCategory.JUDICIAL)).toBeNull();
    expect(getPersonRoleForAllocateRole(RoleCategory.PROFESSIONAL)).toBeNull();
    expect(getPersonRoleForAllocateRole(RoleCategory.CITIZEN)).toBeNull();
    expect(getPersonRoleForAllocateRole(RoleCategory.ALL)).toBeNull();
  });

  describe('getPersonRoleForTaskAssignment', () => {
    it('should return JUDICIAL role for JUDICIAL category', () => {
      const result = getPersonRoleForTaskAssignment('JUDICIAL' as any);

      expect(result).toBe(PersonRole.JUDICIAL);
    });

    it('should return LEGAL_OPERATIONS role for LEGAL_OPERATIONS category', () => {
      const result = getPersonRoleForTaskAssignment('LEGAL_OPERATIONS' as any);

      expect(result).toBe(PersonRole.LEGAL_OPERATIONS);
    });

    it('should return ADMIN role for ADMIN category', () => {
      const result = getPersonRoleForTaskAssignment('ADMIN' as any);

      expect(result).toBe(PersonRole.ADMIN);
    });

    it('should return ALL role for unknown category', () => {
      const result = getPersonRoleForTaskAssignment('UNKNOWN' as any);

      expect(result).toBe(PersonRole.ALL);
    });
  });
});
