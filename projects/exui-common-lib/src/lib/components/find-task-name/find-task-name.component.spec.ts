import { ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatOptionModule} from '@angular/material';
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
    component.findTaskNameControl = new FormControl();
    component.findTaskNameGroup.addControl('findTaskNameControl', new FormControl());
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('is Truthy', () => {
    expect(component).toBeTruthy();
  });


  it('selection change emits change with task name', () => {
    const mockTaskName = 'Review Hearing bundle';

    spyOn(component.taskNameSelected, 'emit');
    component.onSelectionChange(null);
    expect(component.taskNameSelected.emit).not.toHaveBeenCalledWith(null);
    component.onSelectionChange(mockTaskName);
    expect(component.taskNameSelected.emit).toHaveBeenCalledWith(mockTaskName);
  });

  it('should emit an event when search task name emits an event to the component', () => {
    spyOn(component.taskNameFieldChanged, 'emit');
    component.onInput();
    expect(component.taskNameFieldChanged.emit).toHaveBeenCalled();
  });

});
