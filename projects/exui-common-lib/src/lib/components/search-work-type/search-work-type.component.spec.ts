import { fakeAsync, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { FilterFieldConfig } from '../../models/filter.model';
import { WorkType } from '../../models/work-type.model';
import { SearchWorkTypeComponent } from './search-work-type.component';

class MockTaskService {
  public searchWorkTypes = jasmine.createSpy('searchWorkTypes').and.returnValue(of([] as WorkType[]));
}

function buildField(withServicesField = false): FilterFieldConfig {
  return {
    name: 'workTypes',
    options: [],
    minSelected: 0,
    maxSelected: 10,
    type: 'find-work-type',
    ...(withServicesField ? { servicesField: 'services' } : {})
  } as FilterFieldConfig;
}

function setupComponent(opts?: {
  field?: FilterFieldConfig;
  selectedWorkTypes?: WorkType[];
  singleMode?: boolean;
}) {
  const mockService = new MockTaskService();
  const component = new SearchWorkTypeComponent(mockService as any);

  component.form = new FormGroup({});
  component.field = opts?.field ?? buildField(false);
  component.selectedWorkTypes = opts?.selectedWorkTypes ?? [];
  component.singleMode = !!opts?.singleMode;
  component.disabled = false;
  component.submitted = true;

  component.ngOnInit();
  return { component, mockService };
}

describe('SearchWorkTypeComponent', () => {
  it('emits workTypeTermSearchInputChanged on input changes', () => {
    const { component } = setupComponent(); // calls ngOnInit

    const spy = spyOn(component.workTypeTermSearchInputChanged, 'emit');

    // Ensure the stream is “hot” so the tap runs
    const sub = component.filteredList$.subscribe();

    component.searchTermFormControl.setValue('abc');

    expect(spy).toHaveBeenCalledWith('abc');

    sub.unsubscribe();
  });

  it('filters out already selected work types in multi-select mode', fakeAsync(() => {
    const selected = [{ key: 'x', label: 'X' }];
    const { component, mockService } = setupComponent({
      field: buildField(false),
      selectedWorkTypes: selected,
      singleMode: false
    });

    const results: WorkType[] = [
      { key: 'x', label: 'X' },
      { key: 'y', label: 'Y' }
    ];
    mockService.searchWorkTypes.and.callFake(() => of(results));

    let last: WorkType[] | null = undefined;
    component.filteredList$.subscribe(v => (last = v as WorkType[] | null));

    component.searchTermFormControl.setValue('abc');
    tick(300);

    expect(last).toEqual([{ key: 'y', label: 'Y' }]);
  }));

  it('does not filter out selected work types in single mode', fakeAsync(() => {
    const selected = [{ key: 'x', label: 'X' }];
    const { component, mockService } = setupComponent({
      field: buildField(false),
      selectedWorkTypes: selected,
      singleMode: true
    });

    const results: WorkType[] = [
      { key: 'x', label: 'X' },
      { key: 'y', label: 'Y' }
    ];
    mockService.searchWorkTypes.and.callFake(() => of(results));

    let last: WorkType[] | null = undefined;
    component.filteredList$.subscribe(v => (last = v as WorkType[] | null));

    component.searchTermFormControl.setValue('abc');
    tick(300);

    expect(last).toEqual(results);
  }));

  it('onSelectedWorkType sets input value and emits workTypeSelected', () => {
    const { component } = setupComponent();
    const spy = spyOn(component.workTypeSelected, 'emit');
    const wt: WorkType = { key: 'k', label: 'Label' };

    component.onSelectedWorkType(wt);

    expect(component.searchTermFormControl.value).toBe('Label');
    expect(spy).toHaveBeenCalledWith(wt);
  });

  it('onInput emits searchWorkTypeChanged', () => {
    const { component } = setupComponent();
    const spy = spyOn(component.searchWorkTypeChanged, 'emit');

    component.onInput();

    expect(spy).toHaveBeenCalled();
  });

  it('reset input clears the search term', () => {
    const { component } = setupComponent();

    component.searchTermFormControl.setValue('abc');
    component.reset = true;

    expect(component.searchTermFormControl.value).toBe('');
  });
});