import { getPersonRole, getRoleCategory, PersonRole, RoleCategory } from './person.model';

describe('PersonModel', () => {
  it('should return the role category for a person role', () => {
    expect(getRoleCategory(PersonRole.ALL)).toBe(RoleCategory.ALL);
    expect(getRoleCategory(PersonRole.LEGAL_OPERATIONS)).toBe(RoleCategory.LEGAL_OPERATIONS);
    expect(getRoleCategory(PersonRole.ADMIN)).toBe(RoleCategory.ADMIN);
    expect(getRoleCategory(PersonRole.CTSC)).toBe(RoleCategory.CTSC);
    expect(getRoleCategory(PersonRole.JUDICIAL)).toBe(RoleCategory.ALL);
    expect(getRoleCategory(PersonRole.ENFORCEMENT)).toBe(RoleCategory.ENFORCEMENT);
  });

  it('should return the person role for a role category', () => {
    expect(getPersonRole(RoleCategory.LEGAL_OPERATIONS)).toBe(PersonRole.LEGAL_OPERATIONS);
    expect(getPersonRole(RoleCategory.ADMIN)).toBe(PersonRole.ADMIN);
    expect(getPersonRole(RoleCategory.CTSC)).toBe(PersonRole.ADMIN);
    expect(getPersonRole(RoleCategory.JUDICIAL)).toBe(PersonRole.ADMIN);
    expect(getPersonRole(RoleCategory.PROFESSIONAL)).toBe(PersonRole.ADMIN);
    expect(getPersonRole(RoleCategory.CITIZEN)).toBe(PersonRole.ADMIN);
    expect(getPersonRole(RoleCategory.ENFORCEMENT)).toBe(PersonRole.ENFORCEMENT);
    expect(getPersonRole('UNKNOWN')).toBe(PersonRole.ADMIN);
  });
});
