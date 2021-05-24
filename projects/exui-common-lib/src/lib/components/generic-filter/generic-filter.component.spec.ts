import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSetting } from '../../models/filter.model';
import { FilterService } from '../../services/filter/filter.service';
import { GenericFilterComponent } from './generic-filter.component';

describe('GenericFilterComponent', () => {

  let component: GenericFilterComponent;
  let fixture: ComponentFixture<GenericFilterComponent>;
  const filterServiceMock = jasmine.createSpyObj('FilterService', [
    'persist',
    'get',
    'getStream'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericFilterComponent],
      providers: [
        { provide: FilterService, useValue: filterServiceMock }
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
      fields: [{
        name: 'example1',
        options: [
          { key: 'Fernando Alonso', label: 'Fernando Alonso' },
          { key: 'Sebastian Vettel', label: 'Sebastian Vettel' },
          { key: 'Lewis Hamilton', label: 'Lewis Hamilton' },
          { key: 'Mick Schumacher', label: 'Mick Schumacher' },
          { key: 'Lando Norris', label: 'Lando Norris' },
        ],
        title: 'Sample title',
        subTitle: 'Sample subtitle',
        minSelected: 1,
        maxSelected: 1,
        type: 'checkbox'
      }, {
        name: 'example2',
        options: [
          { key: 'Tinky Winky', label: 'Tinky Winky' },
          { key: 'Dipsy', label: 'Dipsy' },
          { key: 'Laa-Laa', label: 'Laa-Laa' },
          { key: 'Po', label: 'Po' },
          { key: 'Noo-noo', label: 'Noo-noo' },
        ],
        title: 'Sample2 title',
        subTitle: 'Sample2 subtitle',
        minSelected: 1,
        maxSelected: 1,
        type: 'radio'
      }, {
        name: 'example3',
        options: [
          { key: 'yellow', label: 'Yellow' },
          { key: 'green', label: 'Green' },
          { key: 'red', label: 'Red' },
          { key: 'blue', label: 'Blue' },
          { key: 'orange', label: 'Orange' },
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined', () => {
    expect(component.config).toBeDefined();
  });

  it('should be undefined', () => {
    expect(component.settings).toBeUndefined();
  });

  it('should be selected', () => {
    expect(component.settings).toBeUndefined();
    const settings: FilterSetting = {
      id: component.config.id,
      fields: [{
        name: 'example1',
        value: [ 'Fernando Alonso', 'Lewis Hamilton' ]
      }, {
        name: 'example2',
        value: [ 'Tinky Winky' ]
      }, {
        name: 'example3',
        value: [ 'yellow', 'green', 'red' ]
      }]
    };
    component.settings = settings;
    fixture.detectChanges();
    expect(component.isSelected(settings.fields[0].name, 'Lewis Hamilton')).toEqual(true);
    expect(component.isSelected(settings.fields[1].name, 'Po')).toEqual(false);
    expect(component.isSelected(settings.fields[1].name, 'Tinky Winky')).toEqual(true);
    expect(component.isSelected(settings.fields[2].name, 'green')).toEqual(true);
    expect(component.isSelected(settings.fields[2].name, 'red')).toEqual(true);
    expect(component.isSelected(settings.fields[2].name, 'blue')).toEqual(false);
  });

});
