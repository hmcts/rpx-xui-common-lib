import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { of, Subject, Subscription } from 'rxjs';
import { FilterFieldConfig } from '../../models';
import { WorkType } from '../../models/work-type.model';
import { TaskService } from '../../services/task/task.service';
import { SearchWorkTypeComponent } from '../search-work-type/search-work-type.component';
import { FindWorkTypeComponent } from './find-work-type.component';

@Pipe({ name: 'rpxTranslate', standalone: true })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string { return value; }
}

describe('FindWorkTypeComponent', () => {
  let component: FindWorkTypeComponent;
  let fixture: ComponentFixture<FindWorkTypeComponent>;

  const mockTaskService = {
    searchWorkTypes: jasmine.createSpy('searchWorkTypes').and.returnValue(of([] as WorkType[]))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule,
        RpxTranslateMockPipe
      ],
      declarations: [FindWorkTypeComponent, SearchWorkTypeComponent],
      providers: [{ provide: TaskService, useValue: mockTaskService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindWorkTypeComponent);
    component = fixture.componentInstance;

    component.field = {
      type: 'find-work-type',
      name: 'work-types',
      options: [],
      minSelected: 0,
      maxSelected: 2
    } as FilterFieldConfig;

    component.form = new FormGroup({
      'work-types': new FormArray([])
    });

    // fields array is used by the 'services' setter; keep minimal here
    component.fields = [component.field];

    fixture.detectChanges();
  });

  function formArray(): FormArray {
    return component.form.get(component.field.name) as FormArray;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addWorkType should push temp selection and reset search', () => {
    expect(formArray().length).toBe(0);

    const wt: WorkType = { key: 'A', label: 'Alpha' };
    component.tempSelectedWorkType = wt;

    spyOn(component.searchWorkTypeComponent, 'resetSearchTerm');

    component.addWorkType();

    expect(formArray().length).toBe(1);
    expect((formArray().at(0).value as WorkType)).toEqual(wt);
    expect(component.tempSelectedWorkType).toBeNull();
    expect(component.searchWorkTypeComponent.resetSearchTerm).toHaveBeenCalled();
  });

  describe('onWorkTypeSelected', () => {
    it('single-select: replaces existing selection', () => {
      component.field.maxSelected = 1;
      component.form.setControl(
        component.field.name,
        new FormArray([new FormControl({ key: 'old', label: 'Old' } as WorkType)])
      );

      const newWt: WorkType = { key: 'new', label: 'New' };
      component.onWorkTypeSelected(newWt);

      const values = (formArray().value as WorkType[]).map(v => v.key);
      expect(values).toEqual(['new']);
    });

    it('multi-select: stores in temp until Add', () => {
      component.field.maxSelected = 3;
      const wt: WorkType = { key: 'B', label: 'Beta' };

      component.onWorkTypeSelected(wt);

      expect(formArray().length).toBe(0);
      expect(component.tempSelectedWorkType).toEqual(wt);
    });
  });

  it('removeWorkType removes the matching entry', () => {
    const a = { key: 'A', label: 'Alpha' } as WorkType;
    const b = { key: 'B', label: 'Beta' } as WorkType;

    component.form.setControl(
      component.field.name,
      new FormArray([new FormControl(a), new FormControl(b)])
    );

    component.removeWorkType(a);

    const keys = (formArray().value as WorkType[]).map(v => v.key);
    expect(keys).toEqual(['B']);
  });

  it('does not stage a duplicate work type in multi-select mode', () => {
    const existing = { key: 'A', label: 'Alpha' } as WorkType;
    component.field.maxSelected = 3;
    component.form.setControl(component.field.name, new FormArray([new FormControl(existing)]));

    component.onWorkTypeSelected(existing);

    expect(component.tempSelectedWorkType).toBeNull();
    expect(formArray().value).toEqual([existing]);
  });

  it('does not stage a work type without a key', () => {
    component.field.maxSelected = 3;

    component.onWorkTypeSelected({ label: 'Missing key' } as WorkType);

    expect(component.tempSelectedWorkType).toBeNull();
    expect(formArray().length).toBe(0);
  });

  it('maps selected service options to service ids and excludes services_all', () => {
    const servicesField = {
      name: 'services',
      options: [
        { key: 'services_all', label: 'All services' },
        { key: 'IA', label: 'Immigration and Asylum' },
        { key: 'SSCS', label: 'Social Security and Child Support' }
      ],
      minSelected: 0,
      maxSelected: 3,
      type: 'checkbox'
    } as FilterFieldConfig;
    component.field.findLocationField = servicesField.name;
    component.fields = [component.field, servicesField];

    component.services = ['services_all', 'IA'];

    expect(component.serviceIds).toBe('IA');
  });

  it('accepts a direct service id string from the services input', () => {
    const servicesField = {
      name: 'services',
      options: [],
      minSelected: 0,
      maxSelected: 3,
      type: 'checkbox'
    } as FilterFieldConfig;
    component.field.findLocationField = servicesField.name;
    component.fields = [component.field, servicesField];

    component.services = 'CIVIL' as unknown as string[];

    expect(component.serviceIds).toBe('CIVIL');
  });

  describe('resetting term search', () => {
    beforeEach(() => {
      component.formSubmissionEvent$ = new Subject<void>();
      component.ngOnInit(); // subscribe to submission events
      spyOn(component.searchWorkTypeComponent, 'resetSearchTerm');
    });

    it('resets the search term on each formSubmissionEvent$ when not exactly one selected in single mode', () => {
      // Use multi-select for predictable reset
      component.field.maxSelected = 3;

      component.formSubmissionEvent$.next();

      expect(component.searchWorkTypeComponent.resetSearchTerm).toHaveBeenCalled();
    });

    it('unsubscribes on ngOnDestroy', () => {
      // @ts-expect-error reading private for test
      spyOn<Subscription>(component.formSubmissionEventSubscription, 'unsubscribe');
      component.ngOnDestroy();
      // @ts-expect-error reading private for test
      expect(component.formSubmissionEventSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });

    it('does not reset a populated single-select search on submission', () => {
      component.field.maxSelected = 1;
      component.form.setControl(
        component.field.name,
        new FormArray([new FormControl({ key: 'A', label: 'Alpha' } as WorkType)])
      );

      component.formSubmissionEvent$.next();

      expect(component.searchWorkTypeComponent.resetSearchTerm).not.toHaveBeenCalled();
    });
  });

  it('onInputChanged clears selection in single-select when term is a string', () => {
    component.field.maxSelected = 1;
    component.form.setControl(
      component.field.name,
      new FormArray([new FormControl({ key: 'A', label: 'Alpha' } as WorkType)])
    );

    component.onInputChanged('abc');

    expect(formArray().length).toBe(0);
  });

  it('should emit workTypeFieldChanged when search input changes', () => {
    const workTypeFieldChangedSpy = spyOn(component.workTypeFieldChanged, 'emit');

    component.onSearchInputChanged();

    expect(workTypeFieldChangedSpy).toHaveBeenCalledTimes(1);
  });

  it('should clear the selected value and reset the search when disabled', () => {
    component.form.setControl(
      component.field.name,
      new FormArray([new FormControl({ key: 'A', label: 'Alpha' } as WorkType)])
    );
    const resetSearchTermSpy = spyOn(component.searchWorkTypeComponent, 'resetSearchTerm');

    component.disabled = true;

    expect(resetSearchTermSpy).toHaveBeenCalledTimes(1);
    expect(formArray().length).toBe(0);
    expect(component.disabled).toBeNull();
  });
});
