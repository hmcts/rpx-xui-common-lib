import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCase } from 'exui-common-lib/lib/models/case-share.model';
import { of } from 'rxjs';
import { ShareCaseComponent } from './share-case.component';

describe('ShareCaseComponent', () => {
  let component: ShareCaseComponent;
  let fixture: ComponentFixture<ShareCaseComponent>;
  let sharedCases: SharedCase[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ShareCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCaseComponent);
    component = fixture.componentInstance;
    sharedCases = [];
    component.shareCases$ = of(sharedCases);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see page elements', () => {
    expect(fixture.debugElement.nativeElement.querySelector('#add-user-hint').textContent).toContain('Search by name or email address. You can only add people from your organisation individually - but you can add as many as you like.');
    expect(fixture.debugElement.nativeElement.querySelector('#btn-add-user').textContent).toContain('Add');
    expect(fixture.debugElement.nativeElement.querySelector('#content-why-can-not-find-email').textContent).toContain('Can’t find an email address?');
    expect(fixture.debugElement.nativeElement.querySelector('#content-reason-can-not-find-email').textContent).toContain('If you can’t find your colleague’s email address, they will need to complete their registration. Contact your administrator for help.');
  });

  it('should see case list', () => {
    component.shareCases = [{
      caseId: 'C111111',
      caseTitle: 'James vs Jane'
    }];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#accordion-with-summary-sections')).toBeTruthy();
  });

  it('should see no case to display', () => {
    component.shareCases = [];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#no-case-display').textContent).toContain('No cases to display.');
  });

  it('should disable continue button where there is not shared cases', () => {
    sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: []
    }];
    component.state$ = of(sharedCases);
    fixture.detectChanges();
    expect(component.isDisabledContinue()).toBeTruthy();
  });

  it('should disable continue button', () => {
    sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }]
    }];
    component.shareCases$ = of(sharedCases);
    fixture.detectChanges();
    expect(component.isDisabledContinue()).toBeTruthy();
  });

  it('should enable continue button when remove user', () => {
    sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }],
      pendingUnshares: [
        {
          idamId: 'u777777',
          firstName: 'Nick',
          lastName: 'Rodrigues',
          email: 'nick.rodrigues@lambbrooks.com'
        }]
    }];
    component.shareCases$ = of(sharedCases);
    fixture.detectChanges();
    expect(component.isDisabledContinue()).toBeFalsy();
  });

  it('should enable continue button when added user', () => {
    sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'u666666',
          firstName: 'Kate',
          lastName: 'Grant',
          email: 'kate.grant@lambbrooks.com'
        }],
      pendingShares: [
        {
          idamId: 'u888888',
          firstName: 'Joel',
          lastName: 'Molloy',
          email: 'joel.molloy@lambbrooks.com'
        }]
    }];
    component.shareCases$ = of(sharedCases);
    fixture.detectChanges();
    expect(component.isDisabledContinue()).toBeFalsy();
  });

  afterEach(() => {
    sharedCases = [];
  });
});
