import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatOptionModule} from '@angular/material';
import {By} from '@angular/platform-browser';
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

});
