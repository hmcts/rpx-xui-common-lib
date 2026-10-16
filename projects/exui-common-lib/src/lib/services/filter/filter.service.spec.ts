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
    sessionStorage.clear();
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('persists legacy local settings in session storage', () => {
    const persistence: FilterPersistence = 'local';
    const setting = { ...filterSetting };
    spyOn(sessionStorage, 'setItem').and.callThrough();
    spyOn(localStorage, 'setItem');

    service.persist(setting, persistence);

    expect(sessionStorage.setItem).toHaveBeenCalledWith(setting.id, JSON.stringify(setting));
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(service.get(setting.id)).toEqual(setting);
  });

  it('persists session settings in session storage', () => {
    const persistence: FilterPersistence = 'session';
    const setting = { ...filterSetting };
    spyOn(sessionStorage, 'setItem').and.callThrough();
    spyOn(localStorage, 'setItem');

    service.persist(setting, persistence);

    expect(sessionStorage.setItem).toHaveBeenCalledWith(setting.id, JSON.stringify(setting));
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(service.get(setting.id)).toEqual(setting);
  });

  it('getStream', () => {
    const persistence: FilterPersistence = 'session';
    service.persist(filterSetting, persistence);
    service.getStream(filterSetting.id).subscribe(response => {
      expect(response).toBeTruthy();
      expect(response).toEqual(filterSetting);
    });
  });

  it('does not restore filters after session storage is cleared on logout', () => {
    service.persist(filterSetting, 'local');
    sessionStorage.clear();

    expect(new FilterService().get(filterSetting.id)).toBeNull();
  });

  it('reads persisted filters without accessing local storage', () => {
    sessionStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    spyOn(localStorage, 'getItem');

    expect(new FilterService().get(filterSetting.id)).toEqual(filterSetting);
    expect(localStorage.getItem).not.toHaveBeenCalled();
  });

  it('clears session persistence without accessing local storage', () => {
    sessionStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    spyOn(sessionStorage, 'removeItem').and.callThrough();
    spyOn(localStorage, 'removeItem');

    service.clearSessionAndLocalPersistance(filterSetting.id);

    expect(sessionStorage.removeItem).toHaveBeenCalledWith(filterSetting.id);
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
  });

});
