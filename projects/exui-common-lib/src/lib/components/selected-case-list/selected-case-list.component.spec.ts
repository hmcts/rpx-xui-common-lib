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
    const mockCase = {caseId: '123456789', caseTitle: 'Example case'};
    spyOn(component.unselect, 'emit');
    component.onUnselect(mockCase);
    expect(component.unselect.emit).toHaveBeenCalledWith(mockCase);
  });

  it('should synchronize store', () => {
    const mockCase = {caseId: '123456789', caseTitle: 'Example case'};
    spyOn(component.synchronizeStore, 'emit');
    component.onSynchronizeStore(mockCase);
    expect(component.synchronizeStore.emit).toHaveBeenCalledWith(mockCase);
  });

  it('should track by cased id', () => {
    sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }]
    };
    expect(component.trackByCaseId(sharedCase)).toEqual('C111111');
  });

});
