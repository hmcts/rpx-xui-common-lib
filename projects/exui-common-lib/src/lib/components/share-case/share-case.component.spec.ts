import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SharedCase, SharedCaseErrorMessages } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { CaseSharingStateService } from '../../services/case-sharing-state/case-sharing-state.service';
import { ShareCaseComponent } from './share-case.component';

describe('ShareCaseComponent', () => {
  let component: ShareCaseComponent;
  let fixture: ComponentFixture<ShareCaseComponent>;
  let sharedCases: SharedCase[] = [];
  let stateService: CaseSharingStateService;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ShareCaseComponent ],
      imports: [ FormsModule, RouterTestingModule ]
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
    stateService = TestBed.get(CaseSharingStateService);
    router = TestBed.get(Router);
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

  it('should not allow to continue where there are no shared cases', () => {
    sharedCases = [{
      caseId: '9417373995765133',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: []
    }];
    component.shareCases$ = of(sharedCases);
    fixture.detectChanges();
    component.setContinueAllowed();
    expect(component.continueAllowed).toBe(false);
  });

  it('should not allow to continue', () => {
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
    component.setContinueAllowed();
    expect(component.continueAllowed).toBe(false);
  });

  it('should allow to continue when removing a user', () => {
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
    component.setContinueAllowed();
    expect(component.continueAllowed).toBe(true);
  });

  it('should allow to continue when adding a user', () => {
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
    component.setContinueAllowed();
    expect(component.continueAllowed).toBe(true);
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

    const addButton = fixture.nativeElement.querySelector('#btn-add-user');
    component.onSelectedUser(user);
    component.shareCases$ = of(sharedCases);
    component.addUser();
    fixture.detectChanges();
    expect(addButton.disabled).toBeTruthy();
    component.setContinueAllowed();
    expect(component.continueAllowed).toBe(true);
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

  it('should onUnselect not display validation errors when more than one case exists after deselecting a case', () => {
    const sharedCase: SharedCase = {
      caseId: 'C123', caseTitle: 'Smith vs Dahl'
    };
    sharedCases = [
      { caseId: 'C111111', caseTitle: 'James vs Jane' },
      { caseId: 'C222222', caseTitle: 'Smith vs Lorraine' }
    ];
    spyOn(stateService, 'getCases').and.returnValue(of(sharedCases));
    component.onUnselect(sharedCase);
    expect(stateService.getCases).toHaveBeenCalled();
    expect(component.validationErrors.length).toEqual(0);
    expect(component.shareCaseErrorMessage).toBeUndefined();
  });

  it('should set an error message if not allowed to continue', () => {
    spyOn(component, 'setContinueAllowed').and.callFake(() => {
      component.continueAllowed = false;
    });
    spyOn(component, 'onContinue').and.callThrough();
    spyOn(router, 'navigate');
    const continueButton = fixture.nativeElement.querySelector('#btn-continue');
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.validationErrors[0]).toEqual({
      id: 'cases',
      message: SharedCaseErrorMessages.NoChangesRequested
    });
    expect(component.shareCaseErrorMessage).toEqual({
      isInvalid: true,
      messages: [SharedCaseErrorMessages.NoChangesRequested]
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the confirmation page if allowed to continue', () => {
    spyOn(component, 'setContinueAllowed').and.callFake(() => {
      component.continueAllowed = true;
    });
    spyOn(component, 'onContinue').and.callThrough();
    spyOn(router, 'navigate');
    const continueButton = fixture.nativeElement.querySelector('#btn-continue');
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([component.confirmLink]);
  });

  it('should get a list of assigned users, both current and pending', () => {
    const user1: UserDetails = {
      idamId : 'aaaa1111-aaaa-1111',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@test.com'
    };
    const user2: UserDetails = {
      idamId : 'aaaa2222-aaaa-2222',
      firstName: 'User',
      lastName: 'Two',
      email: 'user.two@test.com'
    };
    const user3: UserDetails = {
      idamId : 'aaaa3333-aaaa-3333',
      firstName: 'User',
      lastName: 'Three',
      email: 'user.three@test.com'
    };
    const user4: UserDetails = {
      idamId : 'aaaa4444-aaaa-4444',
      firstName: 'User',
      lastName: 'Four',
      email: 'user.four@test.com'
    };
    sharedCases = [
      {
        caseId: '1111111111111111',
        sharedWith: [user1, user3],
        pendingShares: [user4],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '2222222222222222',
        sharedWith: [user4],
        pendingShares: [user2, user3],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    component.getAssignedUsers(sharedCases);
    expect(component.assignedUsers.length).toBe(4);
    expect(component.assignedUsers[0].idamId).toEqual('aaaa1111-aaaa-1111');
    expect(component.assignedUsers[1].idamId).toEqual('aaaa3333-aaaa-3333');
    expect(component.assignedUsers[2].idamId).toEqual('aaaa4444-aaaa-4444');
    expect(component.assignedUsers[3].idamId).toEqual('aaaa2222-aaaa-2222');
  });

  it('should remove a user if one is selected', () => {
    const user1: UserDetails = {
      idamId : 'aaaa1111-aaaa-1111',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@test.com'
    };
    sharedCases = [
      {
        caseId: '1111111111111111',
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '2222222222222222',
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    spyOn(stateService, 'requestUnshare').and.returnValue(sharedCases);
    spyOn(component.synchronizeStore, 'emit');
    component.selectedUserToRemove = user1;
    component.removeUser();
    expect(stateService.requestUnshare).toHaveBeenCalledWith(user1);
    expect(component.synchronizeStore.emit).toHaveBeenCalledWith(sharedCases);
  });

  it('should not remove a user if none is selected', () => {
    spyOn(stateService, 'requestUnshare');
    spyOn(component.synchronizeStore, 'emit');
    component.removeUser();
    expect(stateService.requestUnshare).not.toHaveBeenCalled();
    expect(component.synchronizeStore.emit).not.toHaveBeenCalled();
  });

  it('should get the list of assigned users on component initialization', () => {
    const user1: UserDetails = {
      idamId : 'aaaa1111-aaaa-1111',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@test.com'
    };
    const user2: UserDetails = {
      idamId : 'aaaa2222-aaaa-2222',
      firstName: 'User',
      lastName: 'Two',
      email: 'user.two@test.com'
    };
    const user3: UserDetails = {
      idamId : 'aaaa3333-aaaa-3333',
      firstName: 'User',
      lastName: 'Three',
      email: 'user.three@test.com'
    };
    const user4: UserDetails = {
      idamId : 'aaaa4444-aaaa-4444',
      firstName: 'User',
      lastName: 'Four',
      email: 'user.four@test.com'
    };
    sharedCases = [
      {
        caseId: '1111111111111111',
        sharedWith: [user1, user3],
        pendingShares: [user4],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '2222222222222222',
        sharedWith: [],
        pendingShares: [user2, user3],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    component.shareCases$ = of(sharedCases);
    spyOn(component, 'getAssignedUsers');
    fixture.detectChanges();
    expect(component.getAssignedUsers).toHaveBeenCalledWith([sharedCases[0]]);
  });

  it('should update the list of assigned users when adding a new user', () => {
    const user4: UserDetails = {
      idamId : 'aaaa4444-aaaa-4444',
      firstName: 'User',
      lastName: 'Four',
      email: 'user.four@test.com'
    };
    sharedCases = [
      {
        caseId: '1111111111111111',
        pendingShares: [user4],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    // Set the selected user
    component.onSelectedUser(user4);
    spyOn(stateService, 'requestShare').and.returnValue(sharedCases);
    spyOn(component, 'getAssignedUsers');
    component.addUser();
    expect(component.getAssignedUsers).toHaveBeenCalledWith(sharedCases);
  });

  it('should set an error message if there is at least one case that would become unassigned', () => {
    const user1: UserDetails = {
      idamId : 'aaaa1111-aaaa-1111',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@test.com'
    };
    const user2: UserDetails = {
      idamId : 'aaaa2222-aaaa-2222',
      firstName: 'User',
      lastName: 'Two',
      email: 'user.two@test.com'
    };
    sharedCases = [
      {
        caseId: '1111111111111111',
        sharedWith: [user1],
        pendingUnshares: [user1],
        pendingShares: [user2],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '2222222222222222',
        sharedWith: [user1],
        pendingUnshares: [user1],
        pendingShares: [],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    component.shareCases = sharedCases;
    spyOn(component, 'setContinueAllowed').and.callFake(() => {
      component.continueAllowed = true;
    });
    spyOn(component, 'onContinue').and.callThrough();
    spyOn(component, 'hasCasesLeftUnassigned').and.callThrough();
    spyOn(router, 'navigate');
    const continueButton = fixture.nativeElement.querySelector('#btn-continue');
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.hasCasesLeftUnassigned).toHaveBeenCalledWith(sharedCases);
    const casesLeftUnassigned = component.hasCasesLeftUnassigned(sharedCases);
    expect(casesLeftUnassigned).toBe(true);
    expect(component.validationErrors[0]).toEqual({
      id: 'cases',
      message: SharedCaseErrorMessages.OnePersonMustBeAssigned
    });
    expect(component.shareCaseErrorMessage).toEqual({
      isInvalid: true,
      messages: [SharedCaseErrorMessages.OnePersonMustBeAssigned]
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the confirmation page if there are no cases that would become unassigned', () => {
    const user1: UserDetails = {
      idamId : 'aaaa1111-aaaa-1111',
      firstName: 'User',
      lastName: 'One',
      email: 'user.one@test.com'
    };
    const user2: UserDetails = {
      idamId : 'aaaa2222-aaaa-2222',
      firstName: 'User',
      lastName: 'Two',
      email: 'user.two@test.com'
    };
    sharedCases = [
      {
        caseId: '1111111111111111',
        sharedWith: [user1],
        pendingUnshares: [user1],
        pendingShares: [user2],
        caseTitle: 'Sam Green Vs Williams Lee'
      },
      {
        caseId: '2222222222222222',
        sharedWith: [user1, user2],
        pendingUnshares: [user1],
        pendingShares: [],
        caseTitle: 'Sam Green Vs Williams Lee'
      }
    ];
    component.shareCases = sharedCases;
    spyOn(component, 'setContinueAllowed').and.callFake(() => {
      component.continueAllowed = true;
    });
    spyOn(component, 'onContinue').and.callThrough();
    spyOn(component, 'hasCasesLeftUnassigned').and.callThrough();
    spyOn(router, 'navigate');
    const continueButton = fixture.nativeElement.querySelector('#btn-continue');
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.hasCasesLeftUnassigned).toHaveBeenCalledWith(sharedCases);
    const casesLeftUnassigned = component.hasCasesLeftUnassigned(sharedCases);
    expect(casesLeftUnassigned).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith([component.confirmLink]);
  });

  afterEach(() => {
    sharedCases = [];
  });
});
