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

  it('maps legacy local persistence to session storage', () => {
    const sessionStorageSetItemSpy = spyOn(sessionStorage, 'setItem');

    service.persist(filterSetting, 'local');

    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(filterSetting.id, JSON.stringify(filterSetting));
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

  it('isSameUser - returns false when filter has no persisted user identity', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    spyOn(service, 'getUserId').and.returnValue('1234');
    expect(service.isSameUser('testId')).toEqual(false);
  });

  it('isSameUser - returns false when filter user identity does not match the current user', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    spyOn(service, 'getUserId').and.returnValue('5678');
    expect(service.isSameUser('testId')).toEqual(false);
  });

  it('isSameUser - does not accept a persisted idamId after the storage migration', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting1, persistence);
    spyOn(service, 'getUserId').and.returnValue('1234');
    expect(service.isSameUser('testId1')).toEqual(false);
  });

});
