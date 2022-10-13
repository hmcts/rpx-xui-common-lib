import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { SearchServiceComponent } from '../search-service/search-service.component';
import { FindServiceComponent } from './find-service.component';

describe('FindServiceComponent', () => {
  let component: FindServiceComponent;
  let fixture: ComponentFixture<FindServiceComponent>;
  let service = {
    key: '01',
    label: '01-label',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule, MatOptionModule, FormsModule],
      declarations: [FindServiceComponent, SearchServiceComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindServiceComponent);
    component = fixture.componentInstance;
    component.field = {
      type: 'find-service',
      name: 'services',
      options: [],
      minSelected: 1,
      maxSelected: null
    };
    component.form = new FormGroup({
      services: new FormArray([]),
    });
    let services = [ {
      key: '01',
      label: '01-label',
    },
    {
      key: '03',
      label: '03-label',
    },
    {
      key: null,
      label: '02-label',
    },
  ]
    component.services = services;
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
        key: '01',
        label: '01-label',
      },
      {
        key: '03',
        label: '03-label',
      }
    ]);
  });

  it('addService method should add new row in the selected services', () => {
    component.tempSelectedService = {
        key: '04',
        label: '04-label',
    };
    component.selectedServices = component.services;
    component.addService();
    expect(component.selectedServices.length).toEqual(4);
  });

  it('removeService method should remove a row from the selected services and sort the existing items', () => {
    component.selectedServices = component.services;
    spyOn<any>(component, 'SortAnOptions');
    const formArray = component.form.get(component.field.name) as FormArray;
    for (const service of component.services) {
      formArray.push(new FormControl(service));
    }
    component.removeService(service);
    expect(component.selectedServices.length).toEqual(2);
    expect((component as any).SortAnOptions).toHaveBeenCalled();
  });


  it(`onServiceSelected method should set the value of 'tempSelectedService' to null, if passed service is undefined or null`, () => {
    component.tempSelectedService = service; 
    component.onServiceSelected(null);
    expect(component.tempSelectedService).toEqual(null);
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
    const formArray = component.form.get(component.field.name) as FormArray
    expect(formArray.value).toEqual(component.services);
  });

  it('should emit an event of onError', () => {
    spyOn(component.onError, 'emit');
    (component as any).setServiceError();
    expect(component.onError.emit).toHaveBeenCalled();
  });

  it('should sort an options', () => {
    (component as any).SortAnOptions();
    expect(component.services).toEqual([
      {
        key: '01',
        label: '01-label',
      },
      {
        key: null,
        label: '02-label',
      },
      {
        key: '03',
        label: '03-label',
      }
    ]);
  });

  it('should call the setServiceError, in case tempSelectedService is null', () => {
    component.tempSelectedService = null;
    spyOn<any>(component, 'setServiceError');
    component.addService();
    expect((component as any).setServiceError).toHaveBeenCalled();
  });

 });
