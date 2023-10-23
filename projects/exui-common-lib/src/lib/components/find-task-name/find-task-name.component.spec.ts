import { ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { TaskNameService } from '../../services/task-name/task-name.service';

import {FindTaskNameComponent} from './find-task-name.component';

describe('FindTaskNameComponent', () => {
  let component: FindTaskNameComponent;
  let fixture: ComponentFixture<FindTaskNameComponent>;
  let mockTaskService: TaskNameService;

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
    const mockTaskName = {task_type: {task_type_name: 'Review Hearing bundle', task_type_id: 'reviewHearingBundle'}};

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
