import { of } from 'rxjs';
import { Person, PersonRole, RoleCategory } from '../../models/person.model';
import { FindAPersonService } from './find-person.service';
import { Caseworker } from '../../models';

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

  it('find search should not filter out single non-matching assigned user if passed as a string', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '130' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people));
  });

  it('find search should not filter out single partially matching assigned user if passed as a string', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '12' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people));
  });

  it('find search should not filter out single partially matching assigned user if passed as an array of strings', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: ['12', '130'] };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people));
  });

  it('find search should not filter out single partially matching assigned user if passed as an array of strings', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: ['12', '124'] };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual([people[0], people[2], people[3]]));
  });

  it('find search should not filter out multiple non-matching assigned users if passed as a list of strings', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '130, 131' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual(people));
  });

  it('find search should filter out single matching assigned user if passed as a string', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: '124' };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual([people[0], people[2], people[3]]));
  });

  it('find search should filter out single matching assigned user if passed as an array of strings', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: ['124', '130'] };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual([people[0], people[2], people[3]]));
  });

  it('find search should filter out multiple matching assigned users if passed as an array of strings', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValue(JSON.stringify(userDetails));
    mockHttpService.post.and.returnValue(of(people));
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    const searchOptions = { searchTerm: 'term', services: ['IA'], userRole: PersonRole.JUDICIAL, userIncluded: false, assignedUser: ['124', '125'] };
    service.find(searchOptions).toPromise().then(result => expect(result).toEqual([people[0], people[3]]));
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
    expect(mockHttpService.post).toHaveBeenCalledWith('/workallocation/caseworker/getUsersByServiceName', { services: ['IA'], term: 'term' });
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

  it('should not filter out current user ', () => {
    const caseworkers: Caseworker[] = [
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
        roleCategory: 'CTSC'
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
    mockHttpService.post.and.returnValue(of());
    const mockSessionStorageService = jasmine.createSpyObj('mockSessionStorageService', ['setItem', 'getItem']);
    mockSessionStorageService.getItem.and.returnValues(JSON.stringify(userDetails), undefined, caseworkers);
    const service = new FindAPersonService(mockHttpService, mockSessionStorageService);
    service.userId = '126';

    let searchOptions = { searchTerm: 'four', services: ['IA'], userRole: PersonRole.CASEWORKER };
    const filteredUsersSpecificName = service.searchInCaseworkers(caseworkers, searchOptions);
    expect(filteredUsersSpecificName).toEqual([
      { id: '126', name: 'Test Four', email: 'TestFour@test.com', domain: 'Admin' }
    ]);

    searchOptions = { searchTerm: 'test', services: ['IA'], userRole: PersonRole.CASEWORKER };
    const filteredUsersCaseWorker = service.searchInCaseworkers(caseworkers, searchOptions);
    expect(filteredUsersCaseWorker).toHaveSize(3);
    expect(filteredUsersCaseWorker).toEqual([
      { email: 'TestOne@test.com', name: 'Test One', id: '123', domain: 'Legal Ops' },
      { email: 'TestTwo@test.com', name: 'Test Two', id: '124', domain: 'Legal Ops' },
      { email: 'TestFour@test.com', name: 'Test Four', id: '126', domain: 'Admin' }
    ]);

    searchOptions = { searchTerm: 'test', services: ['IA'], userRole: PersonRole.CTSC };
    const filteredUsersCTSC = service.searchInCaseworkers(caseworkers, searchOptions);
    expect(filteredUsersCTSC).toHaveSize(2);
    expect(filteredUsersCTSC).toEqual([
      { email: 'TestThree@test.com', name: 'Test Three', id: '125', domain: 'Admin' },
      { email: 'TestFour@test.com', name: 'Test Four', id: '126', domain: 'Admin' }
    ]);

    searchOptions = { searchTerm: 'test', services: ['IA'], userRole: PersonRole.ADMIN };
    const filteredUsersAdmin = service.searchInCaseworkers(caseworkers, searchOptions);
    expect(filteredUsersAdmin).toHaveSize(1);
    expect(filteredUsersAdmin).toEqual([
      { email: 'TestFour@test.com', name: 'Test Four', id: '126', domain: 'Admin' }
    ]);
  });
});
