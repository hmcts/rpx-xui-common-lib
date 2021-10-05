import { of } from 'rxjs';
import { Person, PersonRole } from '../../models/person.model';
import { FindAPersonService } from './find-person.service';

describe('FindAPersonService', () => {
  it('should be Truthy', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const service = new FindAPersonService(mockHttpService);
    expect(service).toBeTruthy();
  });

  it('find search', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const service = new FindAPersonService(mockHttpService);
    const searchOptions = { searchTerm: 'term', jurisdiction: PersonRole.JUDICIAL };
    service.find(searchOptions);
    expect(mockHttpService.post).toHaveBeenCalledWith('/workallocation2/findPerson', { searchOptions });
  });

  it('find specific caseworkers', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    mockHttpService.get.and.returnValue(of());
    const service = new FindAPersonService(mockHttpService);
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
        email: 'TestOne@test.com'
      },
      {
        idamId: '124',
        firstName: 'Test',
        lastName: 'Two',
        email: 'TestTwo@test.com'
      },
      {
        idamId: '125',
        firstName: 'Test',
        lastName: 'Three',
        email: 'TestThree@test.com'
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
      }
    ];
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get', 'post']);
    const service = new FindAPersonService(mockHttpService);
    expect(service.mapCaseworkers(caseworkers)).toEqual(people);
  });
});
