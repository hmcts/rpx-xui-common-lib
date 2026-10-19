import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { of } from 'rxjs';
import { TaskService } from '../../services/task/task.service';

import { FindTaskNameComponent } from './find-task-name.component';

describe('FindTaskNameComponent', () => {
  let component: FindTaskNameComponent;
  let fixture: ComponentFixture<FindTaskNameComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  beforeEach(() => {
    mockTaskService = jasmine.createSpyObj<TaskService>('TaskService', ['getTaskName']);
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule
      ],
      declarations: [
        FindTaskNameComponent
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FindTaskNameComponent);

    component = fixture.componentInstance;
    component.findTaskNameGroup = new FormGroup({});
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('is Truthy', () => {
    expect(component).toBeTruthy();
  });

  it('selection change emits change with task name', () => {
    const mockTaskName = { task_type: { task_type_name: 'Review Hearing bundle', task_type_id: 'reviewHearingBundle' } };

    spyOn(component.taskNameSelected, 'emit');
    component.onSelectionChange(null);
    expect(component.taskNameSelected.emit).not.toHaveBeenCalledWith(null);
    component.onSelectionChange(mockTaskName);
    expect(component.taskNameSelected.emit).toHaveBeenCalledWith(mockTaskName);
  });

  it('sets the form control to the selected task name without calling the task service', () => {
    const mockTaskName = { task_type: { task_type_name: 'Review Hearing bundle' } };
    spyOn(component.taskNameSelected, 'emit');

    component.onSelectionChange(mockTaskName);

    expect(component.findTaskNameControl.value).toBe('Review Hearing bundle');
    expect(component.taskNameSelected.emit).toHaveBeenCalledWith(mockTaskName);
    expect(mockTaskService.getTaskName).not.toHaveBeenCalled();
  });

  it('returns an empty task name for an absent selection', () => {
    expect(component.getTaskTypeName(null)).toBe('');
    expect(component.getTaskTypeName(undefined)).toBe('');
  });

  it('returns the nested task type name for a selected task', () => {
    expect(component.getTaskTypeName({ task_type: { task_type_name: 'Review Hearing bundle' } }))
      .toBe('Review Hearing bundle');
  });

  it('loads and filters task names after the minimum debounced search length', fakeAsync(() => {
    const matchingTask = { task_type: { task_type_name: 'Review Hearing bundle' } };
    const otherTask = { task_type: { task_type_name: 'Create order' } };
    mockTaskService.getTaskName.and.returnValue(of([matchingTask, otherTask] as any));
    spyOn(component.taskNameSelected, 'emit');

    component.findTaskNameControl.setValue('hearing');
    expect(component.filteredOptions).toEqual([]);
    tick(299);
    expect(mockTaskService.getTaskName).not.toHaveBeenCalled();

    tick(1);

    expect(mockTaskService.getTaskName).toHaveBeenCalledWith('IA');
    expect(component.filteredOptions).toEqual([matchingTask]);
    expect(component.taskNameSelected.emit).toHaveBeenCalledWith('null');
  }));

  it('does not call the task service for an empty search term', fakeAsync(() => {
    mockTaskService.getTaskName.and.returnValue(of([] as any));
    component.filteredOptions = [{ task_type: { task_type_name: 'Existing' } }];
    spyOn(component.taskNameSelected, 'emit');

    component.findTaskNameControl.setValue('');
    tick(300);

    expect(mockTaskService.getTaskName).not.toHaveBeenCalled();
    expect(component.filteredOptions).toEqual([]);
    expect(component.taskNameSelected.emit).toHaveBeenCalledWith('null');
  }));

  it('keeps the filtered list empty when no task name contains the search term', fakeAsync(() => {
    mockTaskService.getTaskName.and.returnValue(of([
      { task_type: { task_type_name: 'Create order' } }
    ] as any));

    component.findTaskNameControl.setValue('review');
    tick(300);

    expect(component.filteredOptions).toEqual([]);
  }));

  it('unsubscribes from value changes on destroy', fakeAsync(() => {
    mockTaskService.getTaskName.and.returnValue(of([] as any));

    component.ngOnDestroy();
    component.findTaskNameControl.setValue('review');
    tick(300);

    expect(mockTaskService.getTaskName).not.toHaveBeenCalled();
  }));

  it('should emit an event when search task name emits an event to the component', () => {
    spyOn(component.taskNameFieldChanged, 'emit');
    component.onInput();
    expect(component.taskNameFieldChanged.emit).toHaveBeenCalled();
  });
});
