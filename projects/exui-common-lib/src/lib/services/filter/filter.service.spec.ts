import { TestBed } from '@angular/core/testing';
import { FilterPersistence, FilterSetting } from '../../models';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  const filterSetting: FilterSetting = {
    id: 'testId',
    fields: [{
      name: 'field_1',
      value: ['value1', 'value2', 'value3']
    }]
  };
  const filterSetting1: FilterSetting = {
    id: 'testId1',
    idamId: '1234',
    fields: [{
      name: 'field_11',
      value: ['value11', 'value12', 'value13']
    }]
  };

  let service: FilterService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('persist local', () => {
    const persistence: FilterPersistence = 'local';
    service.persist(filterSetting, persistence);
    service.get(filterSetting.id);
    expect(service.get(filterSetting.id)).toEqual(filterSetting);
  });

  it('persist session', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    service.get(filterSetting.id);
    expect(service.get(filterSetting.id)).toEqual(filterSetting);
  });

  it('getStream', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    service.getStream(filterSetting.id).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response).toEqual(filterSetting);
    });
  });

  it('isSameUser - return false if filter idamId is not defined', () => {
    const persistence: FilterPersistence = 'local';
    service.persist(filterSetting, persistence);
    spyOn(service, 'getUserId').and.returnValue('1234');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(filterSetting));
    expect(service.isSameUser('testId')).toEqual(false);
  });

  it('isSameUser - return false if filter idamId is not sane as the user id', () => {
    const persistence: FilterPersistence = 'local';
    service.persist(filterSetting, persistence);
    spyOn(service, 'getUserId').and.returnValue('5678');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(filterSetting));
    expect(service.isSameUser('testId')).toEqual(false);
  });

  it('isSameUser - return true if filter idamId is same as user id', () => {
    const persistence: FilterPersistence = 'local';
    service.persist(filterSetting1, persistence);
    spyOn(service, 'getUserId').and.returnValue('1234');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(filterSetting1));
    expect(service.isSameUser('testId1')).toEqual(false);
  });

});
