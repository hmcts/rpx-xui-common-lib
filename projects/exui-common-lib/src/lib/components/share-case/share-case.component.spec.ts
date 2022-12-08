import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { ShareCaseComponent } from './share-case.component';

describe('ShareCaseComponent', () => {
  let component: ShareCaseComponent;
  let fixture: ComponentFixture<ShareCaseComponent>;
  let sharedCases: SharedCase[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ShareCaseComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCaseComponent);
    component = fixture.componentInstance;
    sharedCases = [];
    component.shareCases$ = of(sharedCases);
    // Deliberately omitted fixture.detectChanges() here because this will trigger the component's ngOnInit() before
    // the showRemoveUsers input value has been set, causing a false failure
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see page elements', () => {
    expect(fixture.debugElement.nativeElement.querySelector('#add-user-hint').textContent).toContain('Search by name or email address. You can share access with as many people as you need.');
    expect(fixture.debugElement.nativeElement.querySelector('#btn-add-user').textContent).toContain('Add');
    expect(fixture.debugElement.nativeElement.querySelector('#content-why-can-not-find-email').textContent).toContain('Can\'t find an email address?');
    expect(fixture.debugElement.nativeElement.querySelector('#content-reason-can-not-find-email').textContent).toContain('If you can\'t find your colleague\'s email address, they will need to complete their registration. Contact your administrator for help.');
    // Elements for removing a user should not be shown
    expect(fixture.debugElement.nativeElement.querySelectorAll('.govuk-label').item(1)).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('#remove-user-hint')).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('#remove-user-input')).toBeNull();
    expect(fixture.debugElement.nativeElement.querySelector('#btn-remove-user')).toBeNull();
  });

  it('should display additional page elements for removing a user', () => {
    component.showRemoveUsers = true;
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelectorAll('.govuk-label').item(1).textContent).toContain('Remove a person from all cases');
    expect(fixture.debugElement.nativeElement.querySelector('#remove-user-hint').textContent).toContain('Select a person to remove them from all selected cases.');
    expect(fixture.debugElement.nativeElement.querySelector('#remove-user-input')).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('#btn-remove-user').textContent).toContain('Remove');
  });

  it('should set the "Add user" label according to the input provided', () => {
    component.addUserLabel = 'Test label';
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelectorAll('.govuk-label').item(0).textContent).toContain('Test label');
  });

  it('should see case list', () => {
    fixture.detectChanges();
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
    expect(fixture.debugElement.nativeElement.querySelector('#noCaseDisplay').textContent).toContain('No cases to display.');
  });

  it('should disable continue button where there is not shared cases', () => {
    sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: []
    }];
    component.shareCases$ = of(sharedCases);
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

  it('should be able to add user', () => {
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

    const user: UserDetails = {
      idamId : 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };

    component.onSelectedUser(user);
    component.shareCases$ = of(sharedCases);
    component.addUser();
    fixture.detectChanges();
    expect(component.isDisabledContinue()).toBeFalsy();
  });

  it('should enable Add button when selected user', () => {
    fixture.detectChanges();
    const user: UserDetails = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    component.shareCases = [{
      caseId: 'C111111',
      caseTitle: 'James vs Jane'
    }];
    const addButton = fixture.nativeElement.querySelector('#btn-add-user');
    component.onSelectedUser(user);
    fixture.detectChanges();
    expect(addButton.disabled).toBeFalsy();
  });

  it('should disable Add button when no share case', () => {
    const user: UserDetails = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    const addButton = fixture.nativeElement.querySelector('#btn-add-user');
    component.onSelectedUser(user);
    fixture.detectChanges();
    expect(addButton.disabled).toBeTruthy();
  });

  it('should disable Add button after selected user is added', () => {
    const user: UserDetails = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    const addButton = fixture.nativeElement.querySelector('#btn-add-user');
    component.onSelectedUser(user);
    component.addUser();
    fixture.detectChanges();
    expect(addButton.disabled).toBeTruthy();
  });

  afterEach(() => {
    sharedCases = [];
  });
});
