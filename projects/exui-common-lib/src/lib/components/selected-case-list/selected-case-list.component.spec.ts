import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedCase } from '../../models/case-share.model';
import { SelectedCaseListComponent } from './selected-case-list.component';

describe('SelectedCaseListComponent', () => {
  let component: SelectedCaseListComponent;
  let sharedCase: SharedCase;

  let fixture: ComponentFixture<SelectedCaseListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SelectedCaseListComponent]
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

  it('should unselect', () => {
    expect(component.onUnselect).toBeDefined();
  });

  it('should synchronize store', () => {
    expect(component.onSynchronizeStore).toBeDefined();
  });

  it('should track by cased id', () => {
    sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com',
        lastUpdated: new Date(),
        accessTypes: [{
          jurisdictionId: '12345',
          organisationProfileId: '12345',
          accessTypeId: '1234',
          enabled: true
        }]
      }]
    };
    expect(component.trackByCaseId(sharedCase)).toEqual('C111111');
  });

});
