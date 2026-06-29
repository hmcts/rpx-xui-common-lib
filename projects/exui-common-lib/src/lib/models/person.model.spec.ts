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
});
