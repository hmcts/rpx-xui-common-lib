import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareCaseComponent } from './share-case.component';

describe('ShareCaseComponent', () => {
  let component: ShareCaseComponent;
  let fixture: ComponentFixture<ShareCaseComponent>;

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
    component.cases = [{
      caseId: 'C111111',
      caseTitle: 'James vs Jane'
    }];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#accordion-with-summary-sections')).toBeTruthy();
  });

  it('should see no case to display', () => {
    component.cases = [];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#noCaseDisplay').textContent).toContain('No cases to display.');
  });
});
