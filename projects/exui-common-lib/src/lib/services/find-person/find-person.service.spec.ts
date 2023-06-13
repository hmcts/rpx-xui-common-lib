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

  const userDetails = {
    id: '1234',
    forename: 'foreName',
    surname: 'surName',
    email: 'email@email.com',
    active: true,
    roles: ['pui-case-manager']
  };

  it('find search', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of());
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '1234' };
    service.find(searchOptions);
    expect(mockHttpService.post).toHaveBeenCalledWith('/workallocation/findPerson', { searchOptions });
  });

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

  it('find search should not filter out current user and assigned user', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '1234' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people));
  });

  it('find search should not filter out current user and assigned user', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '1234' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people));
  });

  it('find search should filter out matching assigned user', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '123' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people.slice(1, 4)));
  });

  it('find specific caseworkers', () => {
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
    mockHttpService.post.and.returnValue(of());
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValues(JSON.stringify(userDetails), undefined, caseworkers);

    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.CASEWORKER };
    service.findCaseworkers(searchOptions);
    expect(mockHttpService.post).toHaveBeenCalledWith('/workallocation/retrieveCaseWorkersForServices', { fullServices: ['IA'] });
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
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    expect(service.mapCaseworkers(caseworkers, RoleCategory.ALL)).toEqual(people);
    expect(service.mapCaseworkers(caseworkers, RoleCategory.CASEWORKER)).toEqual(people.slice(0, 3));
    expect(service.mapCaseworkers(caseworkers, RoleCategory.ADMIN)).toEqual(people.slice(3, 4));
  });
});
