import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { SelectedCaseComponent } from './selected-case.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('SelectedCaseComponent', () => {
  let component: SelectedCaseComponent;
  let fixture: ComponentFixture<SelectedCaseComponent>;
  let user: UserDetails;
  let shareCases: SharedCase[] = [];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedCaseComponent, RpxTranslateMockPipe ],
      imports: [],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCaseComponent);
    component = fixture.componentInstance;
    shareCases = [];
    component.sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }]
    };
    component.shareCases$ = of(shareCases);
    component.ngOnChanges({
      sharedCase: {
        previousValue: {},
        firstChange: false,
        isFirstChange: () => false,
        currentValue: {
          caseId: 'C111111',
          caseTitle: 'Sarah vs Pete',
          sharedWith: [{
            idamId: 'U111111',
            firstName: 'James',
            lastName: 'Priest',
            email: 'james.priest@test.com'
          }]
        }
      }
    });
    component.caseCount = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see page elements', () => {
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'case-title\']').textContent).toContain('Sarah vs Pete');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'case-id\']').textContent).toContain('C111111');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'btn-deselect-case\']').textContent).toContain('Deselect case');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-has-users\']').textContent).toContain('Users from your organisation with access to this case.');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'name-heading\']').textContent).toContain('Name');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'email-heading\']').textContent).toContain('Email address');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'action-heading\']').textContent).toContain('Actions');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'user-full-name\']').textContent).toContain('James Priest');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'user-email\']').textContent).toContain('james.priest@test.com');
  });

  it('should track by user id', () => {
    user = {
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
    };
    expect(component.trackByUserId(user)).toEqual('U111111');
  });

  it('should deselect', () => {
    expect(component.onDeselect).toBeDefined();
  });

  it('remove case is toggled off', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }]
    }];
    component.shareCases$ = of(shareCases);
    component.removeUserFromCaseToggleOn = false;
    fixture.detectChanges();
    user = {
      idamId: 'U111111',
      firstName: 'James',
      lastName: 'Priest',
      email: 'james.priest@test.com'
    };
    component.canRemove('C111111', user).toPromise().then(result => expect(result).toEqual(false));
  });

  it('case cannot be removed', () => {

    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],

      pendingUnshares: [{
        idamId: 'pus111111',
        firstName: 'JamesPUS',
        lastName: 'PriestPUS',
        email: 'jamespus.priestpus@test.com'
      }],
    }];
    component.shareCases$ = of(shareCases);
    component.removeUserFromCaseToggleOn = false;
    fixture.detectChanges();
    user = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    component.canRemove('C111111', user).toPromise().then(result => expect(result).toEqual(false));
  });

  it('case can be removed', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sam Green Vs Williams Lee',
      sharedWith: [
        {
          idamId: 'U111111',
          firstName: 'James',
          lastName: 'Priest',
          email: 'james.priest@test.com'
        }]
    }];
    component.shareCases$ = of(shareCases);
    component.removeUserFromCaseToggleOn = true;
    fixture.detectChanges();

    user = {
      idamId: 'U111111',
      firstName: 'James',
      lastName: 'Priest',
      email: 'james.priest@test.com'
    };
    component.canRemove('C111111', user).toPromise().then(result => expect(result).toEqual(true));
  });

  it('case cannot be cancelled', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],
      pendingShares: [{
        idamId: 'ps111111',
        firstName: 'JamesPS',
        lastName: 'PriestPS',
        email: 'jamesps.priestps@test.com'
      }],
      pendingUnshares: [{
        idamId: 'pus111111',
        firstName: 'JamesPUS',
        lastName: 'PriestPUS',
        email: 'jamespus.priestpus@test.com'
      }],
    }];
    component.shareCases$ = of(shareCases);
    fixture.detectChanges();
    user = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };
    component.canCancel('C111111', user).toPromise().then(result => expect(result).toEqual(true));
  });

  it('case can be cancelled', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],
      pendingShares: [{
        idamId: 'ps111111',
        firstName: 'JamesPS',
        lastName: 'PriestPS',
        email: 'jamesps.priestps@test.com'
      }],
      pendingUnshares: [{
        idamId: 'pus111111',
        firstName: 'JamesPUS',
        lastName: 'PriestPUS',
        email: 'jamespus.priestpus@test.com'
      }],
    }];
    component.shareCases$ = of(shareCases);
    fixture.detectChanges();
    user = {
      idamId: 'ps111111',
      firstName: 'JamesPS',
      lastName: 'PriestPS',
      email: 'jamesps.priestps@test.com'
    };
    component.canCancel('C111111', user).toPromise().then(result => expect(result).toEqual(true));
  });

  it('checking for isToBeRemoved', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],

      pendingUnshares: [{
        idamId: 'pus111111',
        firstName: 'JamesPUS',
        lastName: 'PriestPUS',
        email: 'jamespus.priestpus@test.com'
      }],
    }];
    component.shareCases$ = of(shareCases);
    fixture.detectChanges();
    user = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };

    component.isToBeRemoved('C111111', user).toPromise().then(result => expect(result).toEqual(true));
  });

  it('should display Remove link to already shared user', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],

      pendingUnshares: [{
        idamId: 'pus111111',
        firstName: 'JamesPUS',
        lastName: 'PriestPUS',
        email: 'jamespus.priestpus@test.com'
      }],
    }];
    component.shareCases$ = of(shareCases);
    component.removeUserFromCaseToggleOn = true;
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelectorAll('.govuk-accordion__section-content tbody tr td a');
    expect(userActionLink.length).toEqual(1);
    expect(userActionLink[0].textContent).toContain('Remove');
  });

  it('should display Cancel link to pending unshare user', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],

      pendingUnshares: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],
    }];
    component.shareCases$ = of(shareCases);
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelectorAll('.govuk-accordion__section-content tbody tr td a');
    expect(userActionLink.length).toEqual(1);
    expect(userActionLink[0].textContent).toContain('Cancel');
  });

  it('should call onCancel when when html link cancel clicked', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],

      pendingUnshares: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],
    }];
    spyOn(component, 'onCancel');
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    fixture.detectChanges();

    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr td a');
    expect(userActionLink.textContent).toContain('Cancel');
    userActionLink.click();
    expect(component.onCancel).toHaveBeenCalled();
  });


  it('should display Cancel link to pending share user', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james1.priest@test.com'
      }
    ],
      pendingShares: [{
        idamId: 'N111111',
        firstName: 'New',
        lastName: 'user',
        email: 'new.priest@test.com'
      }
    ]
    }];
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    component.ngOnChanges({
      sharedCase: {
        previousValue: {},
        firstChange: false,
        isFirstChange: () => false,
        currentValue: shareCases[0]
      }
    });
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr:nth-of-type(2) td a');
    expect(userActionLink.textContent).toContain('Cancel');
  });

  it('should call onRemove when when html link Remove clicked', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }],

      pendingUnshares: [],
    }];
    spyOn(component, 'onRemove');
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    component.removeUserFromCaseToggleOn = true;
    fixture.detectChanges();

    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr td a');
    expect(userActionLink.textContent).toContain('Remove');
    userActionLink.click();
    expect(component.onRemove).toHaveBeenCalled();
  });

  it('should display label to be added for pending share user', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james1.priest@test.com'
      }
      ],
      pendingShares: [{
        idamId: 'N111111',
        firstName: 'New',
        lastName: 'user',
        email: 'new.priest@test.com'
      }
      ]
    }];
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    component.ngOnChanges({
      sharedCase: {
        previousValue: {},
        firstChange: false,
        isFirstChange: () => false,
        currentValue: shareCases[0]
      }
    });
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr:nth-of-type(2) td:nth-of-type(4)');
    expect(userActionLink.textContent).toEqual('To be added');
  });

  it('should display label to be Removed for pending unshare user', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }
      ],
      pendingUnshares: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }
      ]
    }];
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr td:nth-of-type(4)');
    expect(userActionLink.textContent).toEqual('To be removed');
  });

  it('should show "All users with access to this case" when a user is added to the case', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }
      ]
    }];
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    fixture.detectChanges();
    expect(component.showUserHasAccessInfo()).toBeTruthy();
    expect(component.showNoUsersAccessInfo()).toBeFalsy();
    expect(component.showUserAccessTable()).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-has-users\']').textContent).toContain('Users from your organisation with access to this case.');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-no-user\']')).toBeNull();
  });

  it('should show "No users currently have access to this case" when no user is assigned to the case', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: []
    }];
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    fixture.detectChanges();
    expect(component.showNoUsersAccessInfo()).toBeTruthy();
    expect(component.showUserHasAccessInfo()).toBeFalsy();
    expect(component.showUserAccessTable()).toBeFalsy();
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-no-user\']').textContent).toContain('No users from your organisation currently have access to this case.');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-has-users\']')).toBeNull();
  });

  it('should show "No users currently have access to this case" when all users are to be removed', () => {
    shareCases = [{
      caseId: 'C111111',
      caseTitle: 'Sarah vs Pete',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }
      ],
      pendingUnshares: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }
      ]
    }];
    component.shareCases$ = of(shareCases);
    component.sharedCase = shareCases[0];
    fixture.detectChanges();
    expect(component.showNoUsersAccessInfo()).toBeTruthy();
    expect(component.showUserHasAccessInfo()).toBeFalsy();
    expect(component.showUserAccessTable()).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-no-user\']').textContent).toContain('No users from your organisation currently have access to this case.');
    expect(fixture.debugElement.nativeElement.querySelector('[id^=\'access-info-has-users\']')).toBeNull();
  });

  describe('combineAndSortShares', () => {
    it('should return a combined and sorted array', () => {
      const sharedWith = [
        {
          firstName: 'C'
        },
        {
          firstName: 'a'
        }
      ];

      const pendingShares = [
        {
          firstName: 'b'
        },
        {
          firstName: 'e'
        }
      ];

      const result = component.combineAndSortShares(sharedWith as UserDetails[], pendingShares as UserDetails[]);
      const expected = [
        {
          firstName: 'a'
        },
        {
          firstName: 'b'
        },
        {
          firstName: 'C'
        },
        {
          firstName: 'e'
        }
      ];

      expect(result).toEqual(expected as UserDetails[]);
    });
  });

  describe('userIdSetter', () => {
    it('should set the correct id when pending', () => {
      const result = component.userIdSetter(true, 4);
      const expected = 'pendingShares-4';

      expect(result).toEqual(expected);
    });

    it('should set the correct id when not pending', () => {
      const result = component.userIdSetter(false, 4);
      const expected = '4';

      expect(result).toEqual(expected);
    });
  });

  afterEach(() => {
    shareCases = [];
  });
});
