import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
      fields: [{
        name: 'example1',
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
        name: 'example2',
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
        name: 'example3',
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

});
