import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatOptionModule} from '@angular/material';
import {By} from '@angular/platform-browser';
import { FilterFieldConfig } from '../../models';
import {FilterService} from '../../services/filter/filter.service';
import {FindPersonComponent} from '../find-person/find-person.component';
import {GenericFilterComponent} from './generic-filter.component';

describe('GenericFilterComponent', () => {

  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule],
      declarations: [GenericFilterComponent, FindPersonComponent],
      providers: [FilterService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFilterComponent);
    component = fixture.componentInstance;
    component.config = {
      id: 'examples',
      applyButtonText: 'apply',
      cancelButtonText: 'cancel',
      fields: [
        {
          name: 'example1',
          options: [
            {key: 'Fernando Alonso', label: 'Fernando Alonso'},
            {key: 'Sebastian Vettel', label: 'Sebastian Vettel'},
            {key: 'Lewis Hamilton', label: 'Lewis Hamilton'},
            {key: 'Mick Schumacher', label: 'Mick Schumacher'},
            {key: 'Lando Norris', label: 'Lando Norris'},
          ],
          title: 'Sample title',
          subTitle: 'Sample subtitle',
          minSelected: 1,
          maxSelected: 1,
          type: 'checkbox'
        },
        {
          name: 'example2',
          options: [
            {key: 'Tinky Winky', label: 'Tinky Winky'},
            {key: 'Dipsy', label: 'Dipsy'},
            {key: 'Laa-Laa', label: 'Laa-Laa'},
            {key: 'Po', label: 'Po'},
            {key: 'Noo-noo', label: 'Noo-noo'},
          ],
          title: 'Sample2 title',
          subTitle: 'Sample2 subtitle',
          minSelected: 1,
          maxSelected: 1,
          type: 'radio'
        },
        {
          name: 'example3',
          options: [
            {key: 'yellow', label: 'Yellow'},
            {key: 'green', label: 'Green'},
            {key: 'red', label: 'Red'},
            {key: 'blue', label: 'Blue'},
            {key: 'orange', label: 'Orange'},
          ],
          title: 'Sample3 title',
          subTitle: 'Sample3 subtitle',
          minSelected: 1,
          maxSelected: 1,
          type: 'select'
        }],
      persistence: 'session',
    };
    fixture.detectChanges();
  });

  it('should build a form a with checkboxes,radio buttons and select input ', () => {

    expect(component.form.value.hasOwnProperty('example1')).toBeTruthy();
    expect(component.form.value.hasOwnProperty('example2')).toBeTruthy();
    expect(component.form.value.hasOwnProperty('example3')).toBeTruthy();

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const checkboxesParentDiv = form.children[0];
    expect((checkboxesParentDiv.querySelector('.govuk-checkboxes') as HTMLElement).children.length).toBe(5);
    expect((checkboxesParentDiv.querySelector('.govuk-checkboxes__item input') as HTMLInputElement).type).toBe('checkbox');

    const radiosParentDiv = form.children[1];
    expect((radiosParentDiv.querySelector('.govuk-radios') as HTMLElement).children.length).toBe(5);
    expect((radiosParentDiv.querySelector('.govuk-radios__item input') as HTMLInputElement).type).toBe('radio');

    const selectInputParentDiv = form.children[2];
    expect((selectInputParentDiv.querySelector('.govuk-select') as HTMLElement).nodeName).toBe('SELECT');
    expect((selectInputParentDiv.querySelector('.govuk-select') as HTMLElement).children.length).toBe(6);
  });

  it('should submit form values if the form is valid', () => {
    component.form.get('example1').patchValue([true]);
    component.form.get('example2').patchValue('Tinky Winky');
    component.form.get('example3').patchValue('yellow');

    fixture.detectChanges();

    expect(component.form.valid).toBeTruthy();
  });

  it('should set form state to be invalid', () => {

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const button: HTMLButtonElement = form.querySelector('button[type="submit"]');
    button.click();
    expect(component.form.invalid).toBeTruthy();
  });

  describe('component methods that use fields', () => {
    const condition = 'selectPerson=Specific person';
    const selectField: FilterFieldConfig = {
      name: 'person',
      options: [
        {
          key: 'Judicial',
          label: 'Judicial'
        },
        {
          key: 'Legal Ops',
          label: 'Legal Ops'
        },
        {
          key: 'Admin',
          label: 'Admin'
        }
      ],
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a role type',
      maxSelectedError: null,
      enableCondition: condition,
      showCondition: condition,
      findPersonField: 'person',
      disabledText: 'Select a role type',
      type: 'select'
    };

    const radioField: FilterFieldConfig = {
      name: 'selectPerson',
      options: [
        {
          key: 'All',
          label: 'All'
        },
        {
          key: 'None / Available tasks',
          label: 'None / Available tasks'
        },
        {
          key: 'Specific person',
          label: 'Specific person'
        }
      ],
      minSelected: 1,
      maxSelected: 1,
      minSelectedError: 'You must select a person',
      maxSelectedError: null,
      lineBreakBefore: true,
      findPersonField: 'person',
      title: 'Person',
      type: 'radio'
    };

    const personField: FilterFieldConfig = {
      name: 'person',
      options: [],
      minSelected: 0,
      maxSelected: 0,
      minSelectedError: 'You must select a person',
      maxSelectedError: null,
      enableCondition: condition,
      showCondition: condition,
      type: 'find-person'
    };

    const formGroup = new FormGroup({
      domain: new FormControl(''),
      email: new FormControl(''),
      id: new FormControl(''),
      name: new FormControl(''),
      knownAs: new FormControl(''),
    });

    it('should correctly set field to disabled when condition met', () => {
      component.form = new FormGroup({});
      component.form.addControl('selectPerson', new FormControl());
      component.form.addControl('person', formGroup);
      // check non-person field to see if it will set correctly
      expect(component.disabled(selectField, component.form)).toBe(true);
      selectField.enableCondition = null;
      expect(component.disabled(selectField, component.form)).toBe(null);

      // check the find-person field to see if it will set correctly
      expect(component.disabled(personField, component.form)).toBe(true);
      // check when condition met, disabled set to false
      component.form.get('selectPerson').patchValue('Specific person');
      expect(component.disabled(personField, component.form)).toBe(null);
    });

    it('should correctly set field to hidden when condition met', () => {
      component.form = new FormGroup({});
      component.form.addControl('selectPerson', new FormControl());
      component.form.addControl('person', formGroup);
      expect(component.hidden(selectField, component.form)).toBe(true);
      selectField.showCondition = null;
      expect(component.hidden(selectField, component.form)).toBe(false);

      expect(component.hidden(personField, component.form)).toBe(true);
      component.form.get('selectPerson').patchValue('Specific person');
      expect(component.hidden(personField, component.form)).toBe(false);
    });

    it('should correctly update domain when dropdown re-selected', () => {
      component.form = new FormGroup({});
      component.form.addControl('selectPerson', new FormControl());
      component.form.addControl('person', formGroup);
      component.form.get('person').get('domain').patchValue('All');
      component.form.get('person').get('email').patchValue('example');
      component.selectChanged(selectField, component.form);
      expect(component.form.get('person').get('domain').value).toBe(null);
      expect(component.form.get('person').get('email').value).toBe(null);
    });

    it('should correctly remove person when radio button changed', () => {
      component.form = new FormGroup({});
      component.form.addControl('selectPerson', new FormControl());
      component.form.addControl('findPersonControl', new FormControl());
      component.form.addControl('person', formGroup);
      component.form.get('person').get('domain').patchValue('All');
      component.form.get('person').get('email').patchValue('example');
      component.radiosChanged(radioField);
      expect(component.form.get('person').get('domain').value).toBe(null);
      expect(component.form.get('person').get('email').value).toBe(null);
    });

    it('should correctly remove person field when method called', () => {
      component.form = new FormGroup({});
      component.form.addControl('selectPerson', new FormControl());
      component.form.addControl('person', formGroup);
      component.form.get('person').get('domain').patchValue('All');
      component.form.get('person').get('email').patchValue('example');
      component.form.get('person').get('id').patchValue('123');
      component.form.get('person').get('name').patchValue('Test');
      component.form.get('person').get('knownAs').patchValue('testing123');
      component.removePersonField(radioField);
      expect(component.form.get('person').get('domain').value).toBe(null);
      expect(component.form.get('person').get('email').value).toBe(null);
      expect(component.form.get('person').get('id').value).toBe(null);
      expect(component.form.get('person').get('name').value).toBe(null);
      expect(component.form.get('person').get('knownAs').value).toBe(null);
    });

  });

});
