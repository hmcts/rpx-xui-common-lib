import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCaseListComponent } from './selected-case-list.component';

describe('SelectedCaseListComponent', () => {
  let component: SelectedCaseListComponent;
  let fixture: ComponentFixture<SelectedCaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedCaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
