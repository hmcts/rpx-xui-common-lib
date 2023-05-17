import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterConfigOption } from '../../models';
import { SearchServiceComponent } from './search-service.component';

describe('SearchServiceComponent', () => {
  let component: SearchServiceComponent;
  let fixture: ComponentFixture<SearchServiceComponent>;
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
      declarations: [SearchServiceComponent],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchServiceComponent);
    component = fixture.componentInstance;
    options = [
      { key: '1', label: 'Service 1' },
      { key: '2', label: 'Service 2' },
      { key: '3', label: 'Another service' },
      { key: '4', label: 'Some other service' }
    ];
    component.options = options;
    component.selectedOptions = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct filtered options when searchTerm is set', () => {
    component.searchTerm = 'some other';
    const result = component.filteredOptions;

    expect(result.length).toBe(1);
    expect(result[0].label).toBe('Some other service');
  });

  it('should return all remaining options when searchTerm is not set', () => {
    component.searchTerm = '';
    const result = component.filteredOptions;

    expect(result.length).toBe(4);
    expect(result[0].label).toBe('Service 1');
    expect(result[1].label).toBe('Service 2');
    expect(result[2].label).toBe('Another service');
    expect(result[3].label).toBe('Some other service');
  });

  it('should set the searchTerm property to an empty string when calling resetSearchTerm', () => {
    component.searchTerm = 'foo';
    component.resetSearchTerm();
    expect(component.searchTerm).toBe('');
  });

  it('should emit the optionChanged event when a valid option is selected', () => {
    const mockEvent = { source: { value: 'Service 1', selected: true } } as MatOptionSelectionChange;
    spyOn(component.optionChanged, 'emit');

    component.onSelectionChanged(mockEvent);

    expect(component.optionChanged.emit).toHaveBeenCalledWith(options[0]);
  });
});
