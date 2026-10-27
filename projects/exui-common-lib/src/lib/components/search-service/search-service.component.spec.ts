import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule, MatOptionSelectionChange } from '@angular/material/core';
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

  for (const disabled of [false, null, undefined, true]) {
    it(`binds disabled=${disabled} to the native property`, () => {
      component.disabled = disabled;
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#inputServiceSearch');
      expect(input.disabled).toBe(disabled === true);
    });
  }

  it('re-enables the native input when disabled changes from true to false', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#inputServiceSearch');
    expect(input.disabled).toBeTrue();

    component.disabled = false;
    fixture.detectChanges();

    expect(input.disabled).toBeFalse();
  });

  it('disables the native input when disabled changes from false to true', () => {
    component.disabled = false;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#inputServiceSearch');
    expect(input.disabled).toBeFalse();

    component.disabled = true;
    fixture.detectChanges();

    expect(input.disabled).toBeTrue();
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

  it('should filter labels case-insensitively and keep matching option order', () => {
    component.searchTerm = 'ANOTHER';

    expect(component.filteredOptions).toEqual([options[2]]);
  });

  it('should exclude selected options before applying the search term', () => {
    component.selectedOptions = [options[1], options[3]];
    component.searchTerm = 'service';

    expect(component.filteredOptions).toEqual([options[0], options[2]]);
  });

  it('should not filter for a search term shorter than three characters', () => {
    component.selectedOptions = [options[1]];
    component.searchTerm = 'se';

    expect(component.filteredOptions).toEqual([options[0], options[2], options[3]]);
  });

  it('should set the searchTerm property to an empty string when calling resetSearchTerm', () => {
    component.searchTerm = 'foo';
    component.resetSearchTerm();
    expect(component.searchTerm).toBe('');
  });

  it('should emit the changed and reset search terms', () => {
    const searchTerms: string[] = [];
    component.searchTermChange.subscribe(value => searchTerms.push(value));

    component.onSearchTermChanged('civil');
    component.resetSearchTerm();

    expect(searchTerms).toEqual(['civil', '']);
  });

  it('should emit the optionChanged event when a valid option is selected', () => {
    const mockEvent = { source: { value: 'Service 1', selected: true } } as MatOptionSelectionChange;
    spyOn(component.optionChanged, 'emit');

    component.onSelectionChanged(mockEvent);

    expect(component.optionChanged.emit).toHaveBeenCalledWith(options[0]);
  });

  it('should not emit optionChanged for a deselected option event', () => {
    const mockEvent = { source: { value: 'Service 1', selected: false } } as MatOptionSelectionChange;
    spyOn(component.optionChanged, 'emit');

    component.onSelectionChanged(mockEvent);

    expect(component.optionChanged.emit).not.toHaveBeenCalled();
  });
});
