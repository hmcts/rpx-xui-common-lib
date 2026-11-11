import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { GovUkDateComponent } from './gov-uk-date.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('GovUkDateComponent', () => {
  let component: GovUkDateComponent;
  let fixture: ComponentFixture<GovUkDateComponent>;
  let group: FormGroup;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ GovUkDateComponent, RpxTranslateMockPipe ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUkDateComponent);
    component = fixture.componentInstance;
    group = formBuilder.group({id_day: '', id_month: '', id_year: ''});
    component.formGroup = group;
    component.config = {id: 'id', name: 'id', label: 'Date field', hint: 'This is a hint'};
    component.errorMessage = {isInvalid: false, messages: ['Error']};
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have input for day, month and year elements', () => {
    fixture.detectChanges();
    const day = fixture.debugElement.query(By.css('#id-day'));
    expect(day).toBeTruthy();
    const month = fixture.debugElement.query(By.css('#id-month'));
    expect(month).toBeTruthy();
    const year = fixture.debugElement.query(By.css('#id-year'));
    expect(year).toBeTruthy();
  });

  it('should set the label and hint text correctly', () => {
    fixture.detectChanges();
    // Check that the correct config parameters have been passed to the fieldset element
    const fieldsetElement = fixture.debugElement.query(By.css('xuilib-gov-uk-fieldset'));
    expect(fieldsetElement.properties.config.legend).toEqual('Date field');
    expect(fieldsetElement.properties.config.hint).toEqual('This is a hint');
  });

  it('should pass validation for a valid date', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2021');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('01');

    expect(group.status).toBe('VALID');
  });

  it('should not pass validation for an invalid date', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2021');
    group.get('id_month').setValue('13');
    group.get('id_day').setValue('01');

    expect(group.status).toBe('INVALID');
  });

  it('should not pass validation for an invalid date with decimal place', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2021');
    group.get('id_month').setValue('13');
    group.get('id_day').setValue('1.');

    expect(group.status).toBe('INVALID');
  });

  it('should fail validation if the day is blank (empty string)', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2021');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('01');
    expect(group.valid).toBeTrue();
    group.get('id_day').setValue('');

    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.status).toBe('INVALID');
  });

  it('should fail validation if the month is blank (null)', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2021');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('01');
    expect(group.valid).toBeTrue();
    group.get('id_month').setValue(null);

    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.status).toBe('INVALID');
  });

  it('should fail validation if the year is blank (null)', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2021');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('01');
    expect(group.valid).toBeTrue();
    group.get('id_year').setValue(null);

    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.status).toBe('INVALID');
  });

  it('should pass validation if the date is optional and day, month, and year are all empty (month is undefined)', () => {
    component.isOptional = true;
    group.get('id_day').setValue(null);
    group.get('id_month').setValue(undefined);
    fixture.detectChanges();

    expect(group.status).toBe('VALID');
  });

  it('should pass validation if the date is optional and day, month, and year are all empty (month is null)', () => {
    component.isOptional = true;
    group.get('id_month').setValue(null);
    fixture.detectChanges();

    expect(group.status).toBe('VALID');
  });

  it('should pass validation if the date is optional and day, month, and year are all empty (month is empty string)', () => {
    component.isOptional = true;
    fixture.detectChanges();

    expect(group.status).toBe('VALID');
  });

  it('should fail validation if the date is optional but day, month, or year are not empty', () => {
    component.isOptional = true;
    fixture.detectChanges();
    expect(group.valid).toBeTrue();
    group.get('id_day').setValue(null);
    group.get('id_month').setValue(undefined);
    group.get('id_year').setValue('2021');

    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.status).toBe('INVALID');
  });

  it('EXUI-5357 D1 invalidates and restores the parent after editing only the month', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('31');
    expect(group.valid).toBeTrue();

    group.get('id_month').setValue('02');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();

    group.get('id_month').setValue('01');
    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();
    expect(group.getRawValue()).toEqual({ id_day: '31', id_month: '01', id_year: '2024' });
  });

  it('EXUI-5357 D2 revalidates leap days across alternating year and month edits', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('02');
    group.get('id_day').setValue('29');
    expect(group.valid).toBeTrue();

    group.get('id_year').setValue('2023');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();
    group.get('id_year').setValue('2024');
    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();

    group.get('id_month').setValue('03');
    expect(group.valid).toBeTrue();
    group.get('id_year').setValue('2023');
    expect(group.valid).toBeTrue();
    group.get('id_month').setValue('02');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();
    group.get('id_year').setValue('2024');
    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();
  });

  it('EXUI-5357 D3 validates normal day month year entry and keeps partial required dates invalid', () => {
    fixture.detectChanges();
    group.get('id_day').setValue('29');
    expect(group.valid).toBeFalse();
    group.get('id_month').setValue('02');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();
    group.get('id_year').setValue('2024');

    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();
    expect(group.getRawValue()).toEqual({ id_day: '29', id_month: '02', id_year: '2024' });
  });

  it('EXUI-5357 D4 revalidates a date seeded before initialization after sibling edits', () => {
    group.setValue({ id_day: '29', id_month: '02', id_year: '2024' });
    fixture.detectChanges();
    expect(group.valid).toBeTrue();

    group.get('id_year').setValue('2023');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();
    group.get('id_month').setValue('03');
    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();
    expect(group.getRawValue()).toEqual({ id_day: '29', id_month: '03', id_year: '2023' });
  });

  it('EXUI-5357 D5 validates direct day corrections without a sibling edit', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('02');
    group.get('id_day').setValue('31');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();

    group.get('id_day').setValue('29');
    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();
    group.get('id_day').setValue('30');
    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.valid).toBeFalse();
  });

  it('EXUI-5357 D6 restores optional validity when clearing day month then year', () => {
    component.isOptional = true;
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('11');
    group.get('id_day').setValue('12');
    expect(group.valid).toBeTrue();

    group.get('id_day').setValue('');
    expect(group.valid).toBeFalse();
    group.get('id_month').setValue('');
    expect(group.valid).toBeFalse();
    group.get('id_year').setValue('');
    expect(group.get('id_day').errors).toBeNull();
    expect(group.valid).toBeTrue();
    expect(group.getRawValue()).toEqual({ id_day: '', id_month: '', id_year: '' });
  });

  it('EXUI-5357 D7 emits parent status changes without false unchanged-day value events', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('31');
    expect(group.valid).toBeTrue();
    const dayValues: string[] = [];
    const statuses: string[] = [];
    const parentValues: unknown[] = [];
    const daySubscription = group.get('id_day').valueChanges.subscribe((value) => dayValues.push(value));
    const statusSubscription = group.statusChanges.subscribe((status) => statuses.push(status));
    const parentSubscription = group.valueChanges.subscribe((value) => parentValues.push(value));

    group.get('id_month').setValue('02');
    expect(group.valid).toBeFalse();
    group.get('id_month').setValue('01');
    expect(group.valid).toBeTrue();

    expect(dayValues).toEqual([]);
    expect(statuses).toEqual(['INVALID', 'VALID']);
    expect(parentValues).toEqual([
      { id_day: '31', id_month: '02', id_year: '2024' },
      { id_day: '31', id_month: '01', id_year: '2024' }
    ]);
    daySubscription.unsubscribe();
    statusSubscription.unsubscribe();
    parentSubscription.unsubscribe();
  });

  it('EXUI-5357 D8 stops invoking the day validator after the fixture is destroyed', () => {
    const validator = jasmine.createSpy('date validator').and.callFake(component.DateValidator());
    spyOn(component, 'DateValidator').and.returnValue(validator);
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('31');
    expect(group.valid).toBeTrue();
    validator.calls.reset();

    group.get('id_month').setValue('02');
    group.get('id_year').setValue('2023');
    expect(validator).toHaveBeenCalledTimes(2);

    fixture.destroy();
    validator.calls.reset();
    group.get('id_month').setValue('01');
    group.get('id_year').setValue('2024');
    expect(validator).not.toHaveBeenCalled();
  });

  it('EXUI-5357 D9 keeps month-onlySelf edits local until the parent is explicitly updated', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('01');
    group.get('id_day').setValue('31');
    expect(group.get('id_day').valid).toBeTrue();
    expect(group.status).toBe('VALID');
    expect(group.value).toEqual({ id_day: '31', id_month: '01', id_year: '2024' });
    const statuses: string[] = [];
    const parentValues: unknown[] = [];
    const statusSubscription = group.statusChanges.subscribe((status) => statuses.push(status));
    const parentSubscription = group.valueChanges.subscribe((value) => parentValues.push(value));

    group.get('id_month').setValue('02', { onlySelf: true });

    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.get('id_day').valid).toBeFalse();
    expect(group.status).toBe('VALID');
    expect(group.value).toEqual({ id_day: '31', id_month: '01', id_year: '2024' });
    expect(group.getRawValue()).toEqual({ id_day: '31', id_month: '02', id_year: '2024' });
    expect(statuses).toEqual([]);
    expect(parentValues).toEqual([]);

    group.updateValueAndValidity();

    expect(group.status).toBe('INVALID');
    expect(group.value).toEqual({ id_day: '31', id_month: '02', id_year: '2024' });
    expect(statuses).toEqual(['INVALID']);
    expect(parentValues).toEqual([{ id_day: '31', id_month: '02', id_year: '2024' }]);
    statusSubscription.unsubscribe();
    parentSubscription.unsubscribe();
  });

  it('EXUI-5357 D10 keeps year-onlySelf edits local until the parent is explicitly updated', () => {
    fixture.detectChanges();
    group.get('id_year').setValue('2024');
    group.get('id_month').setValue('02');
    group.get('id_day').setValue('29');
    expect(group.get('id_day').valid).toBeTrue();
    expect(group.status).toBe('VALID');
    expect(group.value).toEqual({ id_day: '29', id_month: '02', id_year: '2024' });
    const statuses: string[] = [];
    const parentValues: unknown[] = [];
    const statusSubscription = group.statusChanges.subscribe((status) => statuses.push(status));
    const parentSubscription = group.valueChanges.subscribe((value) => parentValues.push(value));

    group.get('id_year').setValue('2023', { onlySelf: true });

    expect(group.get('id_day').errors).toEqual({ dateComponent: true });
    expect(group.get('id_day').valid).toBeFalse();
    expect(group.status).toBe('VALID');
    expect(group.value).toEqual({ id_day: '29', id_month: '02', id_year: '2024' });
    expect(group.getRawValue()).toEqual({ id_day: '29', id_month: '02', id_year: '2023' });
    expect(statuses).toEqual([]);
    expect(parentValues).toEqual([]);

    group.updateValueAndValidity();

    expect(group.status).toBe('INVALID');
    expect(group.value).toEqual({ id_day: '29', id_month: '02', id_year: '2023' });
    expect(statuses).toEqual(['INVALID']);
    expect(parentValues).toEqual([{ id_day: '29', id_month: '02', id_year: '2023' }]);
    statusSubscription.unsubscribe();
    parentSubscription.unsubscribe();
  });
});
