import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchServiceComponent } from './search-service.component';

describe('SearchServiceComponent', () => {
  let component: SearchServiceComponent;
  let fixture: ComponentFixture<SearchServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([]), MatAutocompleteModule, MatOptionModule],
      declarations: [SearchServiceComponent],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchServiceComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
