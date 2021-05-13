import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectedCaseConfirmComponent } from './selected-case-confirm.component';

describe('SelectedCaseConfirmComponent', () => {
  let component: SelectedCaseConfirmComponent;
  let fixture: ComponentFixture<SelectedCaseConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedCaseConfirmComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCaseConfirmComponent);
    component = fixture.componentInstance;
    component.sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Share a case',
      sharedWith: [{
        idamId: 'U111111',
        firstName: 'James',
        lastName: 'Priest',
        email: 'james.priest@test.com'
      }]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show user access block', () => {
    expect(component.showUserAccessBlock()).toBeFalsy();
    fixture.detectChanges();
    const userAccessBlock = fixture.debugElement.nativeElement.querySelector('[id^=\'user-access-block\']');
    expect(userAccessBlock).toBeNull();
  });

  it('should show user access block', () => {
    component.sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Share a case',
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
      }]
    };
    expect(component.showUserAccessBlock()).toBeTruthy();
    fixture.detectChanges();

    const userAccessBlock = fixture.debugElement.nativeElement.querySelector('[id^=\'user-access-block\']');
    expect(userAccessBlock).toBeTruthy();
  });

  afterEach(() => {
    component.sharedCase = null;
    fixture.destroy();
  });
});
