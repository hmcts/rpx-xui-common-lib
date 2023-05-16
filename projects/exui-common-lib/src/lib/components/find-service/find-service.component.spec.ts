import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, Subscription } from 'rxjs';
import { FilterConfigOption } from '../../models';
import { SearchServiceComponent } from '../search-service/search-service.component';
import { FindServiceComponent } from './find-service.component';

describe('FindServiceComponent', () => {
  let component: FindServiceComponent;
  let fixture: ComponentFixture<FindServiceComponent>;
  let options: FilterConfigOption[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatAutocompleteModule,
        MatOptionModule
      ],
      declarations: [FindServiceComponent, SearchServiceComponent],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindServiceComponent);
    component = fixture.componentInstance;
    options = [
      {
        key: 'AAA7',
        label: 'CIVIL',
      },
      {
        key: 'BAC1',
        label: 'SERVICE',
      },
      {
        key: 'ABA5',
        label: 'PRIVATELAW',
      },
    ];

    component.field = {
      type: 'find-service',
      name: 'user-services',
      options,
      minSelected: 1,
      maxSelected: 0
    };
    component.form = new UntypedFormGroup({
      'user-services': new UntypedFormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should sort options alphabetically', () => {
    expect(component.field.options[0].label).toEqual('CIVIL');
    expect(component.field.options[1].label).toEqual('PRIVATELAW');
    expect(component.field.options[2].label).toEqual('SERVICE');
  });

  it('should all the default option if it exists', () => {
    expect(component.selectedServices.length).toEqual(0);
    const defaultOption = {
      key: 'ABA5',
      label: 'PRIVATELAW',
    };
    component.field.defaultOption = defaultOption;
    component.ngOnInit();
    expect(component.selectedServices.length).toEqual(1);
    expect(component.selectedServices).toContain(defaultOption);
  });

  it('addService method should add new row in the selected services', () => {
    expect(component.selectedServices.length).toEqual(0);
    const option = {
      key: 'ABA5',
      label: 'PRIVATELAW',
    };
    component.addOption(option);
    expect(component.selectedServices.length).toEqual(1);
  });


  describe('onOptionSelected', () => {
    it('should call removeAllSelectedValues,' +
      'addSelectedServiceToForm, and emit serviceFieldChanged event when enableAddButton is false and maxSelected is 1', () => {
      component.field.enableAddButton = false;
      component.field.maxSelected = 1;

      spyOn<any>(component, 'removeAllSelectedValues');
      spyOn<any>(component, 'addSelectedServiceToForm');
      spyOn(component.serviceFieldChanged, 'emit');

      component.onOptionSelected(options[0]);

      // @ts-expect-error removeAllSelectedValues is private
      expect(component.removeAllSelectedValues).toHaveBeenCalled();
      // @ts-expect-error addSelectedServiceToForm is private
      expect(component.addSelectedServiceToForm).toHaveBeenCalledWith(options[0]);
      expect(component.serviceFieldChanged.emit).toHaveBeenCalled();
    });

    it('should set tempSelectedService when enableAddButton is true or maxSelected is greater than 1', () => {
      component.field.enableAddButton = true;
      component.field.maxSelected = 2;

      spyOn<any>(component, 'removeAllSelectedValues');
      spyOn<any>(component, 'addSelectedServiceToForm');
      spyOn(component.serviceFieldChanged, 'emit');

      component.onOptionSelected(options[0]);

      expect(component.tempSelectedService).toEqual(options[0]);
      // @ts-expect-error removeAllSelectedValues is private
      expect(component.removeAllSelectedValues).not.toHaveBeenCalled();
      // @ts-expect-error removeAllSelectedValues is private
      expect(component.addSelectedServiceToForm).not.toHaveBeenCalled();
      expect(component.serviceFieldChanged.emit).not.toHaveBeenCalled();
    });
  });

  it('should clear the form array', () => {
    const formArray = new UntypedFormArray([
      new UntypedFormControl('value1'),
      new UntypedFormControl('value2')
    ]);
    component.form.setControl(component.field.name, formArray);
    expect(formArray.length).toBe(2);
    // @ts-expect-error removeAllSelectedValues is private
    component.removeAllSelectedValues();
    expect(formArray.length).toBe(0);
  });

  it('should add a FormControl to the form array', () => {
    const formArray = component.form.get(component.field.name) as UntypedFormArray;
    // @ts-expect-error addSelectedServiceToForm is private
    component.addSelectedServiceToForm(options[0]);

    expect(formArray.length).toBe(1);
    expect(formArray.value[0]).toEqual(options[0]);
  });

  describe('removeOption', () => {
    it('should remove the selected option from the form array and emit serviceFieldChanged event', () => {
      const formArray = new UntypedFormArray([
        new UntypedFormControl(options[0]),
        new UntypedFormControl(options[1])
      ]);
      component.form.setControl(component.field.name, formArray);

      spyOn(component.serviceFieldChanged, 'emit');

      component.removeOption(options[0]);

      expect(formArray.length).toBe(1);
      expect(formArray.controls[0].value).toEqual(options[1]);
      expect(component.serviceFieldChanged.emit).toHaveBeenCalled();
    });

    it('should not remove any options if the selected option is not in the form array', () => {
      const formArray = new UntypedFormArray([
        new UntypedFormControl(options[0]),
        new UntypedFormControl(options[1])
      ]);
      component.form.setControl(component.field.name, formArray);

      spyOn(component.serviceFieldChanged, 'emit');

      component.removeOption(options[2]);

      expect(formArray.length).toBe(2);
    });


    it('should remove all formArrays and make isSelectedAll = true', () => {
      const selectAllOption = { key: 'All', label: 'All', selectAll: true };
      component.form.setControl(component.field.name, new UntypedFormArray([
        new UntypedFormControl(selectAllOption)
      ]));
      // @ts-expect-error isSelectedAll is private
      component.isSelectedAll = true;

      component.removeOption(selectAllOption);

      expect((component.form.get(component.field.name) as UntypedFormArray)?.length).toBe(0);
      // @ts-expect-error isSelectedAll is private
      expect(component.isSelectedAll).toBe(false);
    });
  });

  describe('addOption', () => {
    it('should select all options ' +
      'and emit serviceFieldChanged event when the option has a selectAll property', () => {
      const selectAllOption = { key: 'All', label: 'All', selectAll: true };
      component.field.options.push(selectAllOption);
      spyOn<any>(component, 'removeAllSelectedValues');
      spyOn<any>(component, 'addSelectedServiceToForm').and.callThrough();
      spyOn<any>(component.serviceFieldChanged, 'emit');
      spyOn<any>(component.searchServiceComponent, 'resetSearchTerm');

      component.addOption(selectAllOption);

      // @ts-expect-error private method
      expect(component.isSelectedAll).toBe(true);
      // @ts-expect-error private method
      expect(component.removeAllSelectedValues).toHaveBeenCalled();
      // @ts-expect-error private method
      expect(component.addSelectedServiceToForm).toHaveBeenCalledTimes(3);

      expect(component.serviceFieldChanged.emit).toHaveBeenCalled();
      expect(component.searchServiceComponent.resetSearchTerm).toHaveBeenCalled();
    });

    it('should add a single option ' +
      'and emit serviceFieldChanged event when the option does not have a selectAll property', () => {
      spyOn<any>(component, 'addSelectedServiceToForm').and.callThrough();
      spyOn(component.serviceFieldChanged, 'emit');
      spyOn(component.searchServiceComponent, 'resetSearchTerm');

      component.addOption(options[1]);

      // @ts-expect-error private property
      expect(component.isSelectedAll).toBe(false);
      // @ts-expect-error private method
      expect(component.addSelectedServiceToForm).toHaveBeenCalledWith(options[1]);
      expect(component.serviceFieldChanged.emit).toHaveBeenCalled();
      expect(component.searchServiceComponent.resetSearchTerm).toHaveBeenCalled();
    });

    it('should remove all the selectedValues add then add a single option ' +
      'and emit serviceFieldChanged event when the option does not have a selectAll property and isSelectAll = true', () => {
      // @ts-expect-error private property
      component.isSelectedAll = true;

      spyOn<any>(component, 'removeAllSelectedValues').and.callThrough();
      spyOn<any>(component, 'addSelectedServiceToForm').and.callThrough();
      spyOn(component.serviceFieldChanged, 'emit');
      spyOn(component.searchServiceComponent, 'resetSearchTerm');

      component.addOption(options[1]);

      // @ts-expect-error private property
      expect(component.isSelectedAll).toBe(false);
      // @ts-expect-error private method
      expect(component.removeAllSelectedValues).toHaveBeenCalled();
      // @ts-expect-error private method
      expect(component.addSelectedServiceToForm).toHaveBeenCalledWith(options[1]);
      expect(component.serviceFieldChanged.emit).toHaveBeenCalled();
      expect(component.searchServiceComponent.resetSearchTerm).toHaveBeenCalled();
    });
  });

  describe('resetting term search', () => {
    beforeEach(() => {
      component.formSubmissionEvent$ = new Subject();
      component.ngOnInit();
    });

    it('should reset the search term on each formSubmissionEvent$', () => {
      component.searchServiceComponent.searchTerm = 'test123';
      component.formSubmissionEvent$.next();
      expect(component.searchServiceComponent.searchTerm).toBe('');
    });

    it('should unsubscribe on ngOnDestroy', () => {
      // @ts-expect-error private property
      spyOn<Subscription>(component.formSubmissionEventSubscription, 'unsubscribe');
      component.ngOnDestroy();
      // @ts-expect-error private property
      expect(component.formSubmissionEventSubscription.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
