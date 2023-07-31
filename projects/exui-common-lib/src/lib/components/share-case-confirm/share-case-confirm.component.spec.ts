import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SharedCase } from '../../models/case-share.model';
import { ShareCaseConfirmComponent } from './share-case-confirm.component';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('ShareCaseConfirmComponent', () => {
  let component: ShareCaseConfirmComponent;
  let fixture: ComponentFixture<ShareCaseConfirmComponent>;
  let sharedCases: SharedCase[] = [];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ ShareCaseConfirmComponent, RpxTranslateMockPipe ],
      imports: [ RouterTestingModule ],
      providers: []
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
