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
});
