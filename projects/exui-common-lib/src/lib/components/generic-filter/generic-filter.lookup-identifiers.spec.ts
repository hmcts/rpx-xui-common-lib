import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { of } from 'rxjs';
import { FilterConfig } from '../../models';
import { FindAPersonService } from '../../services/find-person/find-person.service';
import { TaskService } from '../../services/task/task.service';
import { FindPersonComponent } from '../find-person/find-person.component';
import { FindTaskNameComponent } from '../find-task-name/find-task-name.component';
import { GenericFilterComponent } from './generic-filter.component';
import { FilterService } from '../../services';

@Pipe({ name: 'rpxTranslate', standalone: false })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string { return value; }
}

describe('GenericFilter lookup identifiers', () => {
  let fixture: ComponentFixture<GenericFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule],
      declarations: [GenericFilterComponent, FindPersonComponent, FindTaskNameComponent, RpxTranslateMockPipe],
      providers: [
        { provide: FilterService, useValue: { get: (_id: string): null => null, persist: (_value: unknown, _scope: string): void => undefined, givenErrors: { next: (_value: unknown): void => undefined } } },
        { provide: FindAPersonService, useValue: { find: () => of([]), findCaseworkers: () => of([]) } },
        { provide: TaskService, useValue: { getTaskName: () => of([]), getTaskNameUncached: () => of([]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericFilterComponent);
    fixture.componentInstance.config = {
      id: 'lookup-filter',
      persistence: 'memory',
      applyButtonText: 'Apply',
      cancelButtonText: 'Cancel',
      fields: [
        { name: 'person', type: 'find-person', options: [], minSelected: 0, maxSelected: 0 },
        { name: 'task', type: 'find-task-name', options: [], minSelected: 0, maxSelected: 0 }
      ]
    } as FilterConfig;
    fixture.detectChanges();
  });

  it('keeps person and task error descriptions unique and connected to their inputs', () => {
    const component = fixture.componentInstance;
    component.form.setErrors({ error: 'Selection required' });
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const person = host.querySelector('xuilib-find-person input') as HTMLInputElement;
    const task = host.querySelector('xuilib-find-task-name input') as HTMLInputElement;

    expect(person).toBeTruthy();
    expect(task).toBeTruthy();
    expect(person.id).toBe('inputSelectPersonlookup-filter-person');
    expect(task.id).toBe('inputSelectTaskNamelookup-filter-task');
    expect(person.getAttribute('aria-describedby')).toBe('validation-errorlookup-filter-person');
    expect(task.getAttribute('aria-describedby')).toBe('validation-errorlookup-filter-task');
    expect(host.querySelector('#validation-errorlookup-filter-person')).toBeTruthy();
    expect(host.querySelector('#validation-errorlookup-filter-task')).toBeTruthy();
  });
});
