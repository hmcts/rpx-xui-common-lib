import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterService } from '../../services/filter/filter.service';
import { GenericFilterComponent } from './generic-filter.component';

describe('GenericFilterComponent', () => {

  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  const filterServiceMock = jasmine.createSpyObj('FilterService', [
    'persist',
    'get',
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericFilterComponent],
      providers: [{
        provide: FilterService,
        useValue: filterServiceMock,
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFilterComponent);
    component = fixture.componentInstance;
    component.config = {
      id: 'examples',
      fields: [{
        name: 'checkbox example',
        options: [
          { key: 'Fernando Alonso', label: 'Fernando Alonso' },
          { key: 'Sebastian Vettel', label: 'Sebastian Vettel' },
          { key: 'Lewis Hamilton', label: 'Lewis Hamilton' },
          { key: 'Mick Schumacher', label: 'Mick Schumacher' },
          { key: 'Lando Norris', label: 'Lando Norris' },
        ],
        minSelected: 1,
        maxSelected: 1,
        type: 'checkbox'
      }, {
        name: 'radio example',
        options: [
          { key: 'Tinky Winky', label: 'Tinky Winky' },
          { key: 'Dipsy', label: 'Dipsy' },
          { key: 'Laa-Laa', label: 'Laa-Laa' },
          { key: 'Po', label: 'Po' },
          { key: 'Noo-noo', label: 'Noo-noo' },
        ],
        minSelected: 1,
        maxSelected: 1,
        type: 'radio'
      }, {
        name: 'select example',
        options: [
          { key: 'yellow', label: 'Yellow' },
          { key: 'green', label: 'Green' },
          { key: 'red', label: 'Red' },
          { key: 'blue', label: 'Blue' },
          { key: 'orange', label: 'Orange' },
        ],
        minSelected: 1,
        maxSelected: 1,
        type: 'select'
      }],
      persistence: 'local',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined', () => {
    // filterServiceMock.get().and.returnValue(of(component.config));
    expect(component.config).toBeDefined();
  });

  it('should be undefined', () => {
    expect(component.settings).toBeUndefined();
  });

  // it('should retrieve settings from storage', () => {
  //   expect(component.settings).toBeUndefined();
  //   const settings: FilterSetting = { 
  //     id: component.config.id,
  //     fields: [{
  //       name: 'checkbox example',
  //       value: ['Fernando Alonso','Lewis Hamilton']
  //     }, {
  //       name: 'radio example',
  //       value: ['Tinky Winky']
  //     }, {
  //       name: 'select example',
  //       value: ['yellow','green','red']
  //     }]
  //   };
  //   filterServiceMock.persist(settings, component.config.persistence);
  //   const savedSettings = filterServiceMock.get(component.config.id);
  //   expect(savedSettings).toBeUndefined();
  // });

});
