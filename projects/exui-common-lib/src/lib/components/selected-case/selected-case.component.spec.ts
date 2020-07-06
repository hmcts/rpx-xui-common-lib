import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedCaseComponent } from './selected-case.component';

describe('SelectedCaseComponent', () => {
  let component: SelectedCaseComponent;
  let fixture: ComponentFixture<SelectedCaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedCaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCaseComponent);
    component = fixture.componentInstance;
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
});
