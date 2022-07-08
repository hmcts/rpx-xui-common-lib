import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatOptionModule} from '@angular/material';
import {of} from 'rxjs';
import { TaskNameModel } from '../../models/task-name.model';
import { TaskNameService } from '../../services/task-name/task-name.service';

import {FindTaskNameComponent} from './find-task-name.component';

describe('FindTaskNameComponent', () => {
  let component: FindTaskNameComponent;
  let fixture: ComponentFixture<FindTaskNameComponent>;
  let mockTaskService: any;

  beforeEach(() => {
    mockTaskService = jasmine.createSpyObj('TaskNameService', ['getTaskName']);
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
        {provide: TaskNameService, useValue: mockTaskService}
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(FindTaskNameComponent);

    component = fixture.componentInstance;
    component.findTaskNameGroup = new FormGroup({});
    component.findTaskNameGroup.addControl('findTaskNameControl', new FormControl());
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('is Truthy', () => {
    expect(component).toBeTruthy();
  });

  it('input element changes triggers search', async(() => {
    const mockTaskName: TaskNameModel = {
      taskName: 'Review Hearing bundle',
      taskId: 1912,
    };

    mockTaskService.getTaskName.and.returnValue(of([mockTaskName]));
    component.findTaskNameControl.setValue('test');
    fixture.detectChanges();
    setTimeout(() => {
      expect(mockTaskService.getTaskName).toHaveBeenCalled();
    }, 500);
  }));

  it('selection change emits change with task name', () => {
    const mockTaskName: TaskNameModel = {
      taskName: 'Review Hearing bundle',
      taskId: 1912,
    };
    spyOn(component.taskNameSelected, 'emit');
    component.onSelectionChange(null);
    expect(component.taskNameSelected.emit).not.toHaveBeenCalledWith(null);
    component.onSelectionChange(mockTaskName);
    expect(component.taskNameSelected.emit).toHaveBeenCalledWith(mockTaskName.taskName);
  });

  it('should emit an event when search task name emits an event to the component', () => {
    spyOn(component.taskNameFieldChanged, 'emit');
    component.onInput();
    expect(component.taskNameFieldChanged.emit).toHaveBeenCalled();
  });

});
