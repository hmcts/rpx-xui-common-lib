import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatOptionModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { JudicialUserModel } from '../../models';
import { FindAPersonService } from '../../services/find-person/find-person.service';
import { SearchJudicialsComponent } from './search-judicials.component';

describe('SearchJudicialsComponent', () => {
  let component: SearchJudicialsComponent;
  let fixture: ComponentFixture<SearchJudicialsComponent>;
  const searchFilterServiceMock = jasmine.createSpyObj('FindAPersonService', ['searchJudicial']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        MatAutocompleteModule,
        MatOptionModule,
      ],
      declarations: [
        SearchJudicialsComponent
      ],
      providers: [{ provide: FindAPersonService, useValue: searchFilterServiceMock }],
    }).compileComponents();

    const JUDICIAL_RESULTS: JudicialUserModel[] = [
      {
        sidam_id: '38eb0c5e-29c7-453e-b92d-f2029aaed6c1',
        object_id: '38eb0c5e-29c7-453e-b92d-f2029aaed6c1',
        known_as: 'Hearing Judge',
        surname: 'Jacky',
        personal_code: 'P100001',
        full_name: 'Jacky Collins',
        post_nominals: '',
        email_id: 'jacky.collins@judicial.com'
      }
    ];

    fixture = TestBed.createComponent(SearchJudicialsComponent);
    component = fixture.componentInstance;
    const judicialService = TestBed.get(FindAPersonService);
    spyOn(component.keyUpSubject$, 'next');
    spyOn(component.keyUpSubject$, 'pipe').and.returnValue(of('MARCUS'));
    component.displayedJudicials = JUDICIAL_RESULTS;
    spyOn(component, 'searchJudicials').and.callThrough();
    spyOn(component, 'onFocus').and.callThrough();

    judicialService.searchJudicial.and.returnValue(of(JUDICIAL_RESULTS));

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component.searchJudicials).toHaveBeenCalled();
  });

  it('should call onFocus when input has focus', async () => {
    const selectedJudicial = fixture.debugElement.query(By.css('.govuk-input'));
    selectedJudicial.nativeElement.dispatchEvent(new Event('focus'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.onFocus).toHaveBeenCalled();
    });
  });

  it('should call filter when input is more than 2 characters', async () => {
    const selectedJudicial = fixture.debugElement.query(By.css('.govuk-input'));
    selectedJudicial.nativeElement.value = 'MARCUS';
    selectedJudicial.nativeElement.dispatchEvent(new Event('keyup'));

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.keyUpSubject$.subscribe(() => {
        expect(component.keyUpSubject$.next).toHaveBeenCalled();
      });
    });
  });

  it('should not filter in input characters are less then three', async () => {
    expect(component.displayedJudicials.length).toBeGreaterThan(0);

    const selectedJudicial = fixture.debugElement.query(By.css('.govuk-input'));
    selectedJudicial.nativeElement.value = 'ja';
    selectedJudicial.nativeElement.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.filter).not.toHaveBeenCalled();
    });
  });

  it('should reset form control and set to pristine when empty value is given', async () => {
    const selectedJudicial = fixture.debugElement.query(By.css('.govuk-input'));
    selectedJudicial.nativeElement.value = '';
    selectedJudicial.nativeElement.dispatchEvent(new Event('input'));
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.keyUpSubject$.subscribe(() => {
        expect(component.formGroup.controls.selectedFormControl.value).toEqual('');
        expect(component.formGroup.controls.selectedFormControl.pristine).toBeTruthy();
      });
    });
  });
});
