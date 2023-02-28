import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchServiceComponent } from '../search-service/search-service.component';
import { FindServiceComponent } from './find-service.component';

describe('FindServiceComponent', () => {
  let component: FindServiceComponent;
  let fixture: ComponentFixture<FindServiceComponent>;

  const service = {
    key: 'AAA7',
    label: 'CIVIL',
  };

  const allServiceOption = {
    key: 'all',
    label: 'All'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([]), MatAutocompleteModule, MatOptionModule],
      declarations: [FindServiceComponent, SearchServiceComponent],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindServiceComponent);
    component = fixture.componentInstance;
    component.field = {
      type: 'find-service',
      name: 'user-services',
      options: [],
      minSelected: 1,
      maxSelected: 0
    };
    component.fields = [{
      type: 'find-service',
      name: 'user-services',
      options: [],
      minSelected: 1,
      maxSelected: 0
    }];
    component.form = new FormGroup({
      'user-services': new FormArray([]),
    });
    component.searchTermServiceForm = new FormGroup({
      'searchTerm': new FormControl([]),
    });
    const services = [
      {
        key: 'AAA7',
        label: 'CIVIL',
      },
      {
        key: 'ABA5',
        label: 'PRIVATELAW',
      },
    ];
    component.services = services;
    component.selectedServices = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnit should remove row having null key from the selected services', () => {
    component.selectedServices = component.services;
    component.ngOnInit();
    expect(component.selectedServices).toEqual([
      {
        key: 'AAA7',
        label: 'CIVIL',
      },
      {
        key: 'ABA5',
        label: 'PRIVATELAW',
      },
    ]);
  });

  it('addService method should add new row in the selected services', () => {
    component.tempSelectedService = {
        key: '04',
        label: '04-label',
    };
    component.selectedServices = component.services;
    component.addService();
    expect(component.selectedServices.length).toEqual(3);
  });

  it('removeService method should remove a row from the selected services and sort the existing items', () => {
    component.selectedServices = component.services;
    spyOn<any>(component, 'SortAnOptions');
    const formArray = component.form.get(component.field.name) as FormArray;
    for (const s of component.services) {
      formArray.push(new FormControl(s));
    }
    component.removeService(service);
    expect(component.selectedServices.length).toEqual(1);
    expect((component as any).SortAnOptions).toHaveBeenCalled();
  });


  it(`onServiceSelected method should set the value of 'tempSelectedService' to default (All) option, if passed service is undefined or null`, () => {
    component.tempSelectedService = service;
    component.onServiceSelected(null);
    expect(component.tempSelectedService).toEqual(allServiceOption);
  });

  it('onServiceSelected method should call the removeSelectedValues, if field has maxSelected is equal to 1', () => {
    spyOn<any>(component, 'removeSelectedValues');
    component.field.maxSelected = 1;

    component.onServiceSelected(service);
    expect((component as any).removeSelectedValues).toHaveBeenCalled();
  });

  it(`onServiceSelected method should set the value of 'tempSelectedService', if field has maxSelected is not equal to 1`, () => {
    component.field.maxSelected = 2;
    component.onServiceSelected(service);
    expect(component.tempSelectedService).toEqual(service);
  });

  it('removeSelectedValues method should remove element from the form array and make selectedService an empty', () => {
    component.selectedServices = component.services;
    (component as any).removeSelectedValues();
    expect(component.selectedServices).toEqual([]);
  });

  it('addSelectedServicesToForm method should add element ino the the form array', () => {
    component.selectedServices = component.services;
    (component as any).addSelectedServicesToForm(component.services);
    const formArray = component.form.get(component.field.name) as FormArray;
    expect(formArray.value).toEqual(component.services);
  });

  it('should sort an options', () => {
    (component as any).SortAnOptions();
    expect(component.services).toEqual([
      {
        key: 'AAA7',
        label: 'CIVIL',
      },
      {
        key: 'ABA5',
        label: 'PRIVATELAW',
      },
    ]);
  });

  it('if user selects "All" option, it should remove all the existing selected options', () => {
    component.tempSelectedService = allServiceOption;
    component.selectedServices = component.services;
    component.addService();
    expect(component.selectedServices.length).toEqual(1);
  });

  it('if user selects other option, it should remove "All" from the selected options', () => {
    component.tempSelectedService = {
      key: '01',
      label: '01-label',
    };
    component.selectedServices = [];
    component.selectedServices.push(allServiceOption);
    component.addService();
    expect(component.selectedServices.length).toEqual(1);
    expect(component.selectedServices[0]).toEqual({
      key: '01',
      label: '01-label',
    });
  });

  it('if user already selected "All" option, it should not select it again', () => {
    component.tempSelectedService = allServiceOption;
    component.selectedServices = [];
    component.selectedServices.push(allServiceOption);
    component.addService();
    expect(component.selectedServices.length).toEqual(1);
  });

 });
