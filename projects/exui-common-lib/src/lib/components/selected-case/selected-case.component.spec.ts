import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { UserDetails } from '../../models/user-details.model';
import { SelectedCaseComponent } from './selected-case.component';

describe('SelectedCaseComponent', () => {
  let component: SelectedCaseComponent;
  let fixture: ComponentFixture<SelectedCaseComponent>;
  let user: UserDetails;
  let shareCases: SharedCase[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedCaseComponent ]
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see page elements', () => {
    expect(fixture.debugElement.nativeElement.querySelector('#case-title').textContent).toContain('Sarah vs Pete');
    expect(fixture.debugElement.nativeElement.querySelector('#case-id').textContent).toContain('C111111');
    expect(fixture.debugElement.nativeElement.querySelector('#btn-deselect-case').textContent).toContain('Deselect case');
    expect(fixture.debugElement.nativeElement.querySelector('#access-info').textContent).toContain('All users with access to this case.');
    expect(fixture.debugElement.nativeElement.querySelector('#th-name').textContent).toContain('Name');
    expect(fixture.debugElement.nativeElement.querySelector('#th-email').textContent).toContain('Email address');
    expect(fixture.debugElement.nativeElement.querySelector('#th-action').textContent).toContain('Actions');
    expect(fixture.debugElement.nativeElement.querySelector('#user-full-name-0').textContent).toContain('James Priest');
    expect(fixture.debugElement.nativeElement.querySelector('#user-email-0').textContent).toContain('james.priest@test.com');
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

  it('should unselect', () => {
    expect(component.onUnselect).toBeDefined();
  });

  it('should deselect', () => {
    expect(component.onDeselect).toBeDefined();
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
    fixture.detectChanges();
    user = {
      idamId: 'pus111111',
      firstName: 'JamesPUS',
      lastName: 'PriestPUS',
      email: 'jamespus.priestpus@test.com'
    };

    expect(component.canRemove('C111111', user)).toEqual(false);
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
    fixture.detectChanges();

    user = {
      idamId: 'U111111',
      firstName: 'James',
      lastName: 'Priest',
      email: 'james.priest@test.com'
    };
    expect(component.canRemove('C111111', user)).toEqual(true);
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

    expect(component.canCancel('C111111', user)).toEqual(true);
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
    expect(component.canCancel('C111111', user)).toEqual(true);
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

    expect(component.isToBeRemoved('C111111', user)).toEqual(true);
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
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelectorAll('.govuk-accordion__section-content tbody tr td a');
    expect(userActionLink.length).toEqual(1);
    expect(userActionLink[0].textContent).toEqual('Remove');
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
    expect(userActionLink[0].textContent).toEqual('Cancel');
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
    expect(userActionLink.textContent).toEqual('Cancel');
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
    fixture.detectChanges();
    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr:nth-of-type(2) td a');
    expect(userActionLink.textContent).toEqual('Cancel');
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
    fixture.detectChanges();

    const userActionLink = fixture.nativeElement.querySelector('.govuk-accordion__section-content tbody tr td a');
    expect(userActionLink.textContent).toEqual('Remove');
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
    expect(userActionLink.textContent).toEqual('to be removed');
  });

  afterEach(() => {
    shareCases = [];
  });
});
