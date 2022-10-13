import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterConfigOption } from '../../models';
import { SearchServiceComponent } from './search-service.component';
describe('SearchServiceComponent', () => {
  let component: SearchServiceComponent;
  let fixture: ComponentFixture<SearchServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatAutocompleteModule,
        MatOptionModule,
        BrowserAnimationsModule,
      ],
      declarations: [SearchServiceComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchServiceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event of serviceChanged', () => {
    spyOn(component.serviceChanged, 'emit');
    component.services.push(
      {
        key: '01',
        label: '01-label',
      },
      {
        key: '02',
        label: '02-label',
      }
    );
    component.onSelectionChanged('01');
    expect(component.serviceChanged.emit).toHaveBeenCalledWith({
      key: '01',
      label: '01-label',
    } as FilterConfigOption);
  });
});
