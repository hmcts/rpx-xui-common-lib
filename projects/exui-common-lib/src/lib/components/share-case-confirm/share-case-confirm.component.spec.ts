import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedCase } from 'exui-common-lib/lib/models/case-share.model';
import { of } from 'rxjs';
import { ShareCaseConfirmComponent } from './share-case-confirm.component';

describe('ShareCaseConfirmComponent', () => {
  let component: ShareCaseConfirmComponent;
  let fixture: ComponentFixture<ShareCaseConfirmComponent>;
  let sharedCases: SharedCase[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ShareCaseConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareCaseConfirmComponent);
    component = fixture.componentInstance;
    sharedCases = [];
    component.shareCases$ = of(sharedCases);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should see case list', () => {
    component.shareCases = [{
      caseId: 'C111111',
      caseTitle: 'James vs Jane'
    }];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#summarySections')).toBeTruthy();
  });

  it('should see no case to display', () => {
    component.shareCases = [];
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#noCaseDisplay').textContent).toContain('No cases to display.');
  });

  afterEach(() => {
    sharedCases = [];
  });
});
