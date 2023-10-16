import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FilterConfig, FilterFieldConfig, GroupOptions } from '../../models';
import { CapitalizePipe } from '../../pipes';
import { FilterService } from '../../services';
import { LocationService } from '../../services/locations/location.service';
import { FindLocationComponent } from '../find-location/find-location.component';
import { FindPersonComponent } from '../find-person/find-person.component';
import { FindServiceComponent } from '../find-service/find-service.component';
import { FindTaskNameComponent } from '../find-task-name/find-task-name.component';
import { SearchLocationComponent } from '../search-location/search-location.component';
import { SearchServiceComponent } from '../search-service/search-service.component';
import { GenericFilterComponent } from './generic-filter.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GenericFilterComponent', () => {
  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  const mockFilterService: any = {
    getStream: () => of(null),
    getUserId: jasmine.createSpy().and.returnValue('1234'),
    get: jasmine.createSpy(),
    persist: jasmine.createSpy(),
    givenErrors: {
      subscribe: jasmine.createSpy(),
      next: jasmine.createSpy().and.callFake((value: any) => value),
      unsubscribe: (value: any) => value,
    }
  };
  const searchFilterServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule
      ],
      declarations: [
        GenericFilterComponent,
        FindPersonComponent,
        FindLocationComponent,
        SearchLocationComponent,
        FindTaskNameComponent,
        FindServiceComponent,
        SearchServiceComponent,
        CapitalizePipe,
        RpxTranslateMockPipe
      ],
      providers: [
        {provide: FilterService, useValue: mockFilterService},
        {provide: LocationService, useValue: searchFilterServiceMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    mockFilterService.get.and.returnValue(null);
    fixture = TestBed.createComponent(GenericFilterComponent);
    component = fixture.componentInstance;
    component.config = {
      id: 'examples',
      applyButtonText: 'apply',
      cancelButtonText: 'cancel',
      cancelSetting: {
        id: 'examples',
        fields: [{name: 'example1', value: ['Fernando Alonso']}]
      },
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
      showCancelFilterButton: true
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
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const button: HTMLButtonElement = form.querySelector('button[type="submit"]');
    component.form.get('example1').patchValue([true]);
    component.form.get('example2').patchValue('Tinky Winky');
    component.form.get('example3').patchValue('yellow');
    fixture.detectChanges();
    button.click();

    const result = {
      id: 'examples',
      idamId: '1234',
      fields: [
        {
          name: 'example1',
          value: ['Fernando Alonso'],
        },
        {
          name: 'example2',
          value: ['Tinky Winky'],
        },
        {
          name: 'example3',
          value: ['yellow'],
        },
      ],
      reset: false,
    };
    expect(component.form.valid).toBeTruthy();
    mockFilterService.getUserId.and.returnValue('1234');
    expect(mockFilterService.persist).toHaveBeenCalledWith(result, 'session');
  });

  it('should reset the form', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const button: HTMLButtonElement = form.querySelector('#cancelFilter');
    fixture.detectChanges();
    button.click();
    const result = {
      id: 'examples',
      fields: [
        {
          name: 'example1',
          value: ['Fernando Alonso'],
        },
      ],
      reset: true,
    };
    expect(mockFilterService.persist).toHaveBeenCalledWith(result, 'session');
  });

  it('should set form state to be invalid', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const button: HTMLButtonElement = form.querySelector('button[type="submit"]');
    button.click();
    expect(component.form.invalid).toBeTruthy();
  });

  it('should display cancel filter button', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    expect(form.querySelector('button[id="cancelFilter"]')).toBeDefined();
  });

  it('should call callback if cancelButtonCallback exists', () => {
    component.config.cancelButtonCallback = jasmine.createSpy().and.stub();

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const cancelButton = form.querySelector('button[id="cancelFilter"]') as HTMLElement;
    cancelButton.click();

    expect(component.config.cancelButtonCallback).toHaveBeenCalled();
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
      type: 'select',
      disable: true
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
      changeResetFields: ['person'],
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
      type: 'find-person',
      disable: false,
      radioSelectionChange: condition
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
      expect(component.disabled(personField, component.form)).toBe(null);
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
      component.form.addControl('person', formGroup);
      component.form.get('person').get('domain').patchValue('All');
      component.form.get('person').get('email').patchValue('example');
      component.form.addControl('selectPerson', new FormControl('All'));
      component.fieldChanged(radioField, component.form);
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
      component.fieldChanged(radioField, component.form);
      expect(component.form.get('person').get('domain').value).toBe(null);
      expect(component.form.get('person').get('email').value).toBe(null);
      expect(component.form.get('person').get('id').value).toBe(null);
      expect(component.form.get('person').get('name').value).toBe(null);
      expect(component.form.get('person').get('knownAs').value).toBe(null);
    });

    it('should correctly update value when radio button changed', () => {
      component.form = new FormGroup({});
      component.form.addControl('selectPerson', new FormControl());
      component.form.get('selectPerson').patchValue('All');
      component.inputChanged(personField);
      expect(component.form.get('selectPerson').value).toBe('Specific person');
    });

    it('should correctly remove person field when method called', () => {
      component.form = new FormGroup({});

      component.form.addControl('person', formGroup);
      component.form.get('person').get('domain').patchValue('All');
      component.form.get('person').get('email').patchValue('example');
      component.form.get('person').get('id').patchValue('123');
      component.form.get('person').get('name').patchValue('Test');
      component.form.get('person').get('knownAs').patchValue('testing123');

      component.form.addControl('selectPerson', new FormControl('All'));
      component.form.get('selectPerson').patchValue('All');
      component.fieldChanged(radioField, component.form);
      expect(component.form.get('person').get('domain').value).toBe(null);
      expect(component.form.get('person').get('email').value).toBe(null);
      expect(component.form.get('person').get('id').value).toBe(null);
      expect(component.form.get('person').get('name').value).toBe(null);
      expect(component.form.get('person').get('knownAs').value).toBe(null);
    });
  });

  describe('nOnDestroy', () => {
    it('should unsubscribe from form', () => {
      spyOn(component.formSub, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.formSub.unsubscribe).toHaveBeenCalled();
    });

    it('should set givenErrors on filterService to null', () => {
      // component.ngOnDestroy();
      // @ts-expect-error - private property
      expect(component.filterService.givenErrors.next).toHaveBeenCalledWith(null);
    });
  });
});

describe('Select all checkboxes', () => {
  const searchFilterServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);
  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule, HttpClientTestingModule],
      declarations: [
        GenericFilterComponent,
        FindPersonComponent,
        FindLocationComponent,
        SearchLocationComponent,
        FindServiceComponent,
        SearchServiceComponent,
        FindTaskNameComponent,
        CapitalizePipe,
        RpxTranslateMockPipe
      ],
      providers: [
        FilterService,
        { provide: LocationService, useValue: searchFilterServiceMock }
      ]
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
            {key: 'All', label: 'Select All', selectAll: true},
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
      ],
      persistence: 'session',
      showCancelFilterButton: true
    };
    fixture.detectChanges();
  });
  it('should select all checkboxes', () => {

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const checkboxes = form.querySelector('.govuk-checkboxes') as HTMLElement;
    const selectAllInput = checkboxes.querySelector('.govuk-checkboxes__item input') as unknown as HTMLElement;
    selectAllInput.click();
    fixture.detectChanges();

    for (const element of Array.from(checkboxes.children)) {
      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.checked).toBe(true);
    }
  });

  it('should unselect all checkboxes', () => {

    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const checkboxes = form.querySelector('.govuk-checkboxes') as HTMLElement;
    const selectAllInput = checkboxes.querySelector('.govuk-checkboxes__item input') as unknown as HTMLElement;
    selectAllInput.click();
    fixture.detectChanges();

    for (const element of Array.from(checkboxes.children)) {
      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.checked).toBe(true);
    }

    selectAllInput.click();
    fixture.detectChanges();

    for (const element of Array.from(checkboxes.children)) {
      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.checked).toBe(false);
    }
  });
});

describe('Find location filter config', () => {
  const searchFilterServiceMock = jasmine.createSpyObj('LocationService', ['getAllLocations']);
  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule, HttpClientTestingModule],
      declarations: [
        GenericFilterComponent,
        FindPersonComponent,
        FindLocationComponent,
        SearchLocationComponent,
        FindTaskNameComponent,
        FindServiceComponent,
        SearchServiceComponent,
        CapitalizePipe,
        RpxTranslateMockPipe
      ],
      providers: [
        FilterService,
        {provide: LocationService, useValue: searchFilterServiceMock}
      ]
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
          name: 'location',
          options: [],
          title: 'Sample title',
          subTitle: 'Sample subtitle',
          minSelected: 1,
          maxSelected: 1,
          type: 'find-location'
        }
      ],
      persistence: 'session',
      showCancelFilterButton: true
    };
    fixture.detectChanges();
  });
  xit('should display find-location filter', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const findLocationFormGroup = form.querySelector('xuilib-find-location') as HTMLElement;
    expect(findLocationFormGroup).toBeTruthy();
  });


  describe('group-select dropdown', () => {
    const groupOptions: GroupOptions[] =  [
      {
        group: 'servieA',
        options: [
          {key: 'serviceA-key1', label: 'Key1'},
          {key: 'serviceA-key3', label: 'Key3'},
          {key: 'serviceA-key2', label: 'Key2'}
        ]
      },
      {
        group: 'servieC',
        options: [
          {key: 'serviceC-key3', label: 'Key3'},
          {key: 'serviceC-key2', label: 'Key2'},
          {key: 'serviceC-key1', label: 'Key1'}
        ]
      },
      {
        group: 'servieB',
        options: [
          {key: 'serviceB-key2', label: 'Key2'},
          {key: 'serviceB-key1', label: 'Key1'},
          {key: 'serviceB-key3', label: 'Key3'}
        ]
      }
    ];

    const sortedGroupOptions: GroupOptions[] =  [
      {
        group: 'servieA',
        options: [
          {key: 'serviceA-key1', label: 'Key1'},
          {key: 'serviceA-key2', label: 'Key2'},
          {key: 'serviceA-key3', label: 'Key3'}
        ]
      },
      {
        group: 'servieB',
        options: [
          {key: 'serviceB-key1', label: 'Key1'},
          {key: 'serviceB-key2', label: 'Key2'},
          {key: 'serviceB-key3', label: 'Key3'}
        ]
      },
      {
        group: 'servieC',
        options: [
          {key: 'serviceC-key1', label: 'Key1'},
          {key: 'serviceC-key2', label: 'Key2'},
          {key: 'serviceC-key3', label: 'Key3'}
        ]
      }
    ];

    const selectField: FilterFieldConfig = {
      name: 'user-skills',
      title: 'Skills',
      options: [],
      groupOptions,
      minSelected: 0,
      maxSelected: 0,
      type: 'group-select',
      lineBreakBefore: true,
      disabledText: 'All'
    };

    const filterConfig: FilterConfig = {
      id: 'staff-advanced-filters',
      fields: [selectField],
      persistence: 'session',
      applyButtonText: 'Search',
      cancelButtonText: '',
      enableDisabledButton: false,
      showCancelFilterButton: false
    };

    it('should display group-dropdown', () => {
      component.form = new FormGroup({});
      component.form.addControl('group-dropdown', new FormControl());
      expect(component).toBeTruthy();
      expect(component.filterSkillsByServices(null, filterConfig)).toEqual(sortedGroupOptions);
    });

    describe('filterSkillsByServices', () => {
      it('should return all skills sorted alphabetically, if no service is passed', () => {
        const actualValues = component.filterSkillsByServices(null, filterConfig);
        expect(actualValues).toEqual(sortedGroupOptions);
      });

      it('should return filtered skills sorted alphabetically, if service is passed', () => {
        const actualValues = component.filterSkillsByServices(['servieA'], filterConfig);
        expect(actualValues).toEqual([sortedGroupOptions[0]]);
      });

      it('should return filtered skills sorted alphabetically, if service is passed', () => {
        const actualValues = component.filterSkillsByServices(['servieA', 'servieB'], filterConfig);
        expect(actualValues).toEqual([sortedGroupOptions[0], sortedGroupOptions[1]]);
      });
    });
  });
});

describe('Task Name Filter', () => {
  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  let fieldName: string;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule, HttpClientTestingModule],
      declarations: [
        GenericFilterComponent,
        FindTaskNameComponent,
        CapitalizePipe,
        RpxTranslateMockPipe
      ],
      providers: [
        FilterService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fieldName = 'taskNameFilter';
    fixture = TestBed.createComponent(GenericFilterComponent);
    component = fixture.componentInstance;
    component.config = {
      id: 'examples',
      applyButtonText: 'apply',
      cancelButtonText: 'cancel',
      fields: [
        {
          name: fieldName,
          title: 'Task by name',
          options: [],
          minSelected: 0,
          maxSelected: 1,
          findLocationField: 'service',
          servicesField: 'service',
          minSelectedError: 'You must select a task name',
          maxSelectedError: null,
          enableAddTaskNameButton: false,
          type: 'find-task-name',
        }
      ],
      persistence: 'session',
      showCancelFilterButton: true
    };
    fixture.detectChanges();
  });

  it('should display find-task-filter filter', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form: HTMLFormElement = formDebugElement.nativeElement as HTMLFormElement;
    const findTaskNameFilterElement = form.querySelector('xuilib-find-task-name') as HTMLElement;
    expect(findTaskNameFilterElement).toBeTruthy();
  });
  it('should add a formGroup and a form control', () => {
    expect(component.form.get(fieldName)).toBeInstanceOf(FormGroup);
    expect(component.form.get(fieldName).get('task_type_id')).toBeInstanceOf(FormControl);
    expect(component.form.get(fieldName).get('task_type_name')).toBeInstanceOf(FormControl);

    expect(component.form.get('findTaskNameControl')).toBeInstanceOf(FormControl);
  });
});
