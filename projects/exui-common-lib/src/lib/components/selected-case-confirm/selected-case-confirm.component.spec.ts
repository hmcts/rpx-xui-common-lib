import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SelectedCaseConfirmComponent } from './selected-case-confirm.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('SelectedCaseConfirmComponent', () => {
  let component: SelectedCaseConfirmComponent;
  let fixture: ComponentFixture<SelectedCaseConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SelectedCaseConfirmComponent, RpxTranslateMockPipe],
      imports: [RouterTestingModule],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCaseConfirmComponent);
    component = fixture.componentInstance;
    component.sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Share a case',
      sharedWith: [
        {
          idamId: 'U111111',
          firstName: 'James',
          lastName: 'Priest',
          email: 'james.priest@test.com',
          userAccessTypes: [
            {
              jurisdictionId: '12345',
              organisationProfileId: '12345',
              accessTypeId: '1234',
              enabled: true
            }
          ]
        }
      ]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show user access block', () => {
    expect(component.showUserAccessBlock()).toBeFalsy();
    fixture.detectChanges();
    const userAccessBlock = fixture.debugElement.nativeElement.querySelector(
      '[id^=\'user-access-block\']'
    );
    expect(userAccessBlock).toBeNull();
  });

  it('should show user access block', () => {
    component.sharedCase = {
      caseId: 'C111111',
      caseTitle: 'Share a case',
      sharedWith: [
        {
          idamId: 'U111111',
          firstName: 'James',
          lastName: 'Priest',
          email: 'james.priest@test.com',
          userAccessTypes: [
            {
              jurisdictionId: '12345',
              organisationProfileId: '12345',
              accessTypeId: '1234',
              enabled: true
            }
          ]
        }
      ],
      pendingUnshares: [
        {
          idamId: 'U111111',
          firstName: 'James',
          lastName: 'Priest',
          email: 'james.priest@test.com',
          userAccessTypes: [
            {
              jurisdictionId: '12345',
              organisationProfileId: '12345',
              accessTypeId: '1234',
              enabled: true
            }
          ]
        }
      ]
    };
    expect(component.showUserAccessBlock()).toBeTruthy();
    fixture.detectChanges();

    const userAccessBlock = fixture.debugElement.nativeElement.querySelector(
      '[id^=\'user-access-block\']'
    );
    expect(userAccessBlock).toBeTruthy();
  });

  afterEach(() => {
    component.sharedCase = null;
    fixture.destroy();
  });
});
