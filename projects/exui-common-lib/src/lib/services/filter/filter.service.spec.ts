import { TestBed } from '@angular/core/testing';
import { FilterSetting } from '../../models';
import { FilterService } from './filter.service';

describe('FilterService', () => {
  const ownerHash = 'a'.repeat(64);
  const otherOwnerHash = 'b'.repeat(64);
  const filterSetting: FilterSetting = {
    id: 'testId',
    fields: [{ name: 'field_1', value: ['value1', 'value2', 'value3'] }]
  };
  const ownedSetting = { ...filterSetting, ownerHash };
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sessionStorage.clear();
    localStorage.removeItem(filterSetting.id);
    sessionStorage.setItem('userDetails', JSON.stringify({ id: 'current-user', filterOwnerHash: ownerHash }));
    service = TestBed.inject(FilterService);
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.removeItem(filterSetting.id);
  });

  it('persists local filters with a hash and without a raw user ID', () => {
    service.persist({ ...filterSetting, idamId: 'legacy-user' } as FilterSetting, 'local');
    expect(JSON.parse(localStorage.getItem(filterSetting.id))).toEqual(ownedSetting);
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
  });

  it('restores local filters in a new instance for the same user', () => {
    service.persist(filterSetting, 'local');
    expect(new FilterService().get(filterSetting.id)).toEqual(ownedSetting);
  });

  it('restores local filters in another tab with the same owner reference', () => {
    service.persist(filterSetting, 'local');
    sessionStorage.clear();
    sessionStorage.setItem('userDetails', JSON.stringify({ filterOwnerHash: ownerHash }));
    expect(new FilterService().get(filterSetting.id)).toEqual(ownedSetting);
  });

  it('prefers the owned local filter over a colliding legacy session filter', () => {
    const localFilter = { ...ownedSetting, fields: [{ name: 'types-of-work', value: ['applications'] }] };
    localStorage.setItem(filterSetting.id, JSON.stringify(localFilter));
    sessionStorage.setItem(filterSetting.id, JSON.stringify({
      ...filterSetting, fields: [{ name: 'types-of-work', value: ['exception_report'] }]
    }));
    expect(new FilterService().get(filterSetting.id)).toEqual(localFilter);
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
  });

  it('removes the colliding session entry when a local filter is saved', () => {
    sessionStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    service.persist(filterSetting, 'local');
    expect(sessionStorage.getItem(filterSetting.id)).toBeNull();
    expect(new FilterService().get(filterSetting.id)).toEqual(ownedSetting);
  });

  it('ignores another user local filter after signing out and signing in', () => {
    service.persist(filterSetting, 'local');
    sessionStorage.clear();
    sessionStorage.setItem('userDetails', JSON.stringify({ id: 'another-user', filterOwnerHash: otherOwnerHash }));
    expect(new FilterService().get(filterSetting.id)).toBeNull();
  });

  it('ignores cached owned filters when the current user changes', () => {
    service.persist(filterSetting, 'local');
    sessionStorage.setItem('userDetails', JSON.stringify({ filterOwnerHash: otherOwnerHash }));
    expect(service.get(filterSetting.id)).toBeNull();
  });

  it('rejects and removes legacy local filters containing a raw ID', () => {
    localStorage.setItem(filterSetting.id, JSON.stringify({ ...filterSetting, idamId: 'current-user' }));
    expect(service.get(filterSetting.id)).toBeNull();
    expect(localStorage.getItem(filterSetting.id)).toBeNull();
  });

  it('rejects local filters without ownership metadata', () => {
    localStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    expect(service.get(filterSetting.id)).toBeNull();
  });

  it('does not accept local filters when no current owner reference is available', () => {
    localStorage.setItem(filterSetting.id, JSON.stringify(ownedSetting));
    sessionStorage.removeItem('userDetails');
    expect(service.get(filterSetting.id)).toBeNull();
  });

  it('uses session persistence when the backend has not supplied an owner reference', () => {
    sessionStorage.setItem('userDetails', JSON.stringify({ id: 'current-user' }));
    service.persist(filterSetting, 'local');
    expect(localStorage.getItem(filterSetting.id)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(filterSetting.id))).toEqual(filterSetting);
  });

  it('allows a second user to save their own selections without inheriting the first user selections', () => {
    service.persist(filterSetting, 'local');
    sessionStorage.clear();
    sessionStorage.setItem('userDetails', JSON.stringify({ filterOwnerHash: otherOwnerHash }));
    const nextService = new FilterService();
    expect(nextService.get(filterSetting.id)).toBeNull();
    const nextFilter = { ...filterSetting, fields: [{ name: 'field_1', value: ['other-value'] }] };
    nextService.persist(nextFilter, 'local');
    expect(new FilterService().get(filterSetting.id)).toEqual({ ...nextFilter, ownerHash: otherOwnerHash });
    sessionStorage.setItem('userDetails', JSON.stringify({ filterOwnerHash: ownerHash }));
    expect(new FilterService().get(filterSetting.id)).toBeNull();
  });

  it('preserves session settings when a colliding local filter belongs to another user', () => {
    localStorage.setItem(filterSetting.id, JSON.stringify({ ...filterSetting, ownerHash: otherOwnerHash }));
    sessionStorage.setItem(filterSetting.id, JSON.stringify(filterSetting));
    expect(service.get(filterSetting.id)).toEqual(filterSetting);
    expect(sessionStorage.getItem(filterSetting.id)).not.toBeNull();
  });

  it('persists session settings and removes any colliding local filter', () => {
    localStorage.setItem(filterSetting.id, JSON.stringify(ownedSetting));
    service.persist(filterSetting, 'session');
    expect(JSON.parse(sessionStorage.getItem(filterSetting.id))).toEqual(filterSetting);
    expect(localStorage.getItem(filterSetting.id)).toBeNull();
    expect(new FilterService().get(filterSetting.id)).toEqual(filterSetting);
  });

  it('does not restore session filters after session storage is cleared', () => {
    service.persist(filterSetting, 'session');
    sessionStorage.clear();
    expect(new FilterService().get(filterSetting.id)).toBeNull();
  });

  it('clears local, session and cached filters and notifies subscribers', () => {
    service.persist(filterSetting, 'local');
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
