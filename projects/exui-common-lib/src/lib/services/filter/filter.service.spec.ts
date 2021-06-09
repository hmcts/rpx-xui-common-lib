import { TestBed } from '@angular/core/testing';
import { FilterPersistence, FilterSetting } from '../../models/filter.model';
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

});
