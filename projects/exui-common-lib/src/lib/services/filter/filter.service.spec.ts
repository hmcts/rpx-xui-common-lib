import { TestBed } from '@angular/core/testing';
import { FilterSetting } from '../../models';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  const filterSetting: FilterSetting = {
    id: 'testId',
    fields: [{ name: 'field_1', value: ['value1', 'value2', 'value3'] }]
  };
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sessionStorage.clear();
    localStorage.removeItem(filterSetting.id);
    sessionStorage.setItem('userDetails', JSON.stringify({ id: 'current-user' }));
    service = TestBed.inject(FilterService);
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.removeItem(filterSetting.id);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('persists local filters with the current user ID', () => {
    service.persist({ ...filterSetting }, 'local');
    expect(JSON.parse(localStorage.getItem(filterSetting.id))).toEqual({ ...filterSetting, idamId: 'current-user' });
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
  });

  it('restores local filters in another instance for the same user', () => {
    service.persist({ ...filterSetting }, 'local');
    expect(new FilterService().get(filterSetting.id)).toEqual({ ...filterSetting, idamId: 'current-user' });
  });

  it('does not restore local filters belonging to another user', () => {
    service.persist({ ...filterSetting }, 'local');
    sessionStorage.setItem('userDetails', JSON.stringify({ id: 'another-user' }));
    expect(new FilterService().get(filterSetting.id)).toBeNull();
  });

  it('does not restore local filters without an owner ID', () => {
    localStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    expect(service.get(filterSetting.id)).toBeNull();
  });

  it('uses uid when id is absent', () => {
    sessionStorage.setItem('userDetails', JSON.stringify({ uid: 'uid-user' }));
    service.persist({ ...filterSetting }, 'local');
    expect(JSON.parse(localStorage.getItem(filterSetting.id)).idamId).toBe('uid-user');
    expect(new FilterService().get(filterSetting.id)?.idamId).toBe('uid-user');
  });

  it('persists session settings without accessing local storage', () => {
    spyOn(localStorage, 'setItem');
    service.persist({ ...filterSetting }, 'session');
    expect(JSON.parse(sessionStorage.getItem(filterSetting.id))).toEqual(filterSetting);
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(service.get(filterSetting.id)).toEqual(filterSetting);
  });

  it('does not restore session filters after session storage is cleared', () => {
    service.persist({ ...filterSetting }, 'session');
    sessionStorage.clear();
    expect(new FilterService().get(filterSetting.id)).toBeNull();
  });

  it('reads session settings without accessing local storage', () => {
    sessionStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    spyOn(localStorage, 'getItem');
    expect(service.get(filterSetting.id)).toEqual(filterSetting);
    expect(localStorage.getItem).not.toHaveBeenCalled();
  });

  it('clears local, session and cached filters and notifies subscribers', () => {
    service.persist({ ...filterSetting }, 'local');
    sessionStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    let latest: FilterSetting;
    service.getStream(filterSetting.id).subscribe((value) => latest = value);
    service.clearSessionAndLocalPersistance(filterSetting.id);
    expect(localStorage.getItem(filterSetting.id)).toBeNull();
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
    expect(service.get(filterSetting.id)).toBeNull();
    expect(latest).toBeNull();
  });
});
