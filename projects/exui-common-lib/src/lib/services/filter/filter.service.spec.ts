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
  let service: FilterService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.get(FilterService);
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

  it('should check if session persistence and call deleteItem if exists and calling clearSessionAndLocalPersistence', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    service.clearSessionAndLocalPersistance(filterSetting.id);
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
  });

  it('should delete localStorage persistence if exists and calling clearSessionAndLocalPersistence', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    service.clearSessionAndLocalPersistance(filterSetting.id);
    expect(localStorage.getItem(filterSetting.id)).toBeNull();
  });
});
