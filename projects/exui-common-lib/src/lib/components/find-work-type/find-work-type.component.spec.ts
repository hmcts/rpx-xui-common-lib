import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { of, Subject, Subscription } from 'rxjs';
import { FilterFieldConfig } from '../../models';
import { WorkType } from '../../models/work-type.model';
import { TaskService } from '../../services/task/task.service';
import { SearchWorkTypeComponent } from '../search-work-type/search-work-type.component';
import { FindWorkTypeComponent } from './find-work-type.component';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rpxTranslate', standalone: true })
class RpxTranslateMockPipe implements PipeTransform {
  transform(value: string): string { return value; }
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
      'work-types': new FormArray([]),
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
});