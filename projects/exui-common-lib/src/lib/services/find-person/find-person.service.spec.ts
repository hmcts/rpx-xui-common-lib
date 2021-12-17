import { of } from 'rxjs';
import { Person, PersonRole, RoleCategory } from '../../models/person.model';
import { FindAPersonService } from './find-person.service';

describe('FindAPersonService', () => {
  it('should be Truthy', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    expect(service).toBeTruthy();
  });

  it('find search', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', jurisdiction: PersonRole.JUDICIAL };
    service.find(searchOptions);
    expect(mockHttpService.post).toHaveBeenCalledWith('/workallocation2/findPerson', { searchOptions });
  });

  it('find specific caseworkers', () => {
    const userDetails = `{
      "id": "125"
    }`;
    const caseworkers = `[
      {
        "idamId": "123",
        "firstName": "Test",
        "lastName": "One",
        "email": "TestOne@test.com",
        "roleCategory": "LEGAL_OPERATIONS"
      },
      {
        "idamId": "124",
        "firstName": "Test",
        "lastName": "Two",
        "email": "TestTwo@test.com",
        "roleCategory": "LEGAL_OPERATIONS"
      },
      {
        "idamId": "125",
        "firstName": "Test",
        "lastName": "Three",
        "email": "TestThree@test.com",
        "roleCategory": "LEGAL_OPERATIONS"
      },
      {
        "idamId": "126",
        "firstName": "Test",
        "lastName": "Four",
        "email": "TestFour@test.com",
        "roleCategory": "ADMIN"
      }
    ]`;
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    mockHttpService.get.and.returnValue(of());
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValues(userDetails, undefined, caseworkers);

    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', jurisdiction: PersonRole.CASEWORKER };
    service.findCaseworkers(searchOptions);
    expect(mockHttpService.get).toHaveBeenCalledWith('/workallocation2/caseworker');
  });

  it('should change caseworkers to people', () => {
    const caseworkers: any[] = [
      {
        idamId: '123',
        firstName: 'Test',
        lastName: 'One',
        email: 'TestOne@test.com',
        roleCategory: 'LEGAL_OPERATIONS'
      },
      {
        idamId: '124',
        firstName: 'Test',
        lastName: 'Two',
        email: 'TestTwo@test.com',
        roleCategory: 'LEGAL_OPERATIONS'
      },
      {
        idamId: '125',
        firstName: 'Test',
        lastName: 'Three',
        email: 'TestThree@test.com',
        roleCategory: 'LEGAL_OPERATIONS'
      },
      {
        idamId: '126',
        firstName: 'Test',
        lastName: 'Four',
        email: 'TestFour@test.com',
        roleCategory: 'ADMIN'
      }
    ];
    const people: Person[] = [
      {
        id: '123',
        name: 'Test One',
        email: 'TestOne@test.com',
        domain: PersonRole.CASEWORKER
      },
      {
        id: '124',
        name: 'Test Two',
        email: 'TestTwo@test.com',
        domain: PersonRole.CASEWORKER
      },
      {
        id: '125',
        name: 'Test Three',
        email: 'TestThree@test.com',
        domain: PersonRole.CASEWORKER
      },
      {
        id: '126',
        name: 'Test Four',
        email: 'TestFour@test.com',
        domain: PersonRole.ADMIN
      }
    ];
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    expect(service.mapCaseworkers(caseworkers, RoleCategory.ALL)).toEqual(people);
    expect(service.mapCaseworkers(caseworkers, RoleCategory.CASEWORKER)).toEqual(people.slice(0, 3));
    expect(service.mapCaseworkers(caseworkers, RoleCategory.ADMIN)).toEqual(people.slice(3, 4));
  });
});
