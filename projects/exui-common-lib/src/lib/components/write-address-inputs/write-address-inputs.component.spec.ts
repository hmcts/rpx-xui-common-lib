import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WriteAddressInputsComponent } from './write-address-inputs.component';

describe('WriteAddressFieldComponent', () => {
  @Component({
    selector: 'write-address-inputs',
    template: `<xuilib-write-address-inputs [formGroup]="formGroup" [isInternational]="isInternational">
    </xuilib-write-address-inputs>`
  })
  class WrapperComponent {
    @ViewChild(WriteAddressInputsComponent, /* TODO: add static flag */ {})
    public componentUnderTest: WriteAddressInputsComponent;
    public formGroup = addressFormGroup();
    public isInternational: boolean;
  }
  let wrapperComponent: any;
  let fixture: ComponentFixture<WrapperComponent>;

  function addressFormGroup() {
    return new FormGroup({
      address: new FormGroup({
        addressLine1: new FormControl(),
        addressLine2: new FormControl(),
        addressLine3: new FormControl(),
        postTown: new FormControl(),
        county: new FormControl(),
        postCode: new FormControl(),
        country: new FormControl()
      })
    });
  }

  beforeEach(waitForAsync(() => {
    TestBed
      .configureTestingModule({
        imports: [
          ReactiveFormsModule
        ],
        declarations: [
          WriteAddressInputsComponent,
          WrapperComponent
        ],
        providers: []
      })
      .compileComponents();

    fixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = fixture.componentInstance;
    wrapperComponent.isInternational = false;
    fixture.detectChanges();
  }));

  it('should set isAddressMaxLengthEnabled based on the current platform URL', () => {
    wrapperComponent.componentUnderTest.ngOnInit();
    spyOnProperty(window, 'location').and.returnValue({
      href: 'https://manage-org.demo.platform.hmcts.net'
    } as Location);
    expect(wrapperComponent.componentUnderTest.isAddressMaxLengthEnabled).toBeTrue();
    spyOnProperty(window, 'location').and.returnValue({
      href: 'https://approve-org.demo.platform.hmcts.net'
    } as Location);
    expect(wrapperComponent.componentUnderTest.isAddressMaxLengthEnabled).toBeFalse();
  });

  it('should render the correct labels', () => {
    const element = fixture.debugElement.nativeElement;
    expect(element.querySelectorAll('.govuk-label').item(0).textContent.trim()).toContain('Enter address details');
    expect(element.querySelectorAll('.govuk-label').item(1).textContent.trim()).toContain('Building and Street');
    expect(element.querySelectorAll('.govuk-label').item(2).textContent.trim()).toContain('Address line 2 (Optional)');
    expect(element.querySelectorAll('.govuk-label').item(3).textContent.trim()).toContain('Address line 3 (Optional)');
    expect(element.querySelectorAll('.govuk-label').item(4).textContent.trim()).toContain('Town or City');
    expect(element.querySelectorAll('.govuk-label').item(5).textContent.trim()).toContain('County (Optional)');
    expect(element.querySelectorAll('.govuk-label').item(6).textContent.trim()).toContain('Postcode');

    wrapperComponent.isInternational = true;
    fixture.detectChanges();

    expect(element.querySelectorAll('.govuk-label').item(0).textContent.trim()).toContain('Enter address details');
    expect(element.querySelectorAll('.govuk-label').item(1).textContent.trim()).toContain('Building and Street');
    expect(element.querySelectorAll('.govuk-label').item(2).textContent.trim()).toContain('Address line 2 (Optional)');
    expect(element.querySelectorAll('.govuk-label').item(3).textContent.trim()).toContain('Address line 3 (Optional)');
    expect(element.querySelectorAll('.govuk-label').item(4).textContent.trim()).toContain('Town or City');
    expect(element.querySelectorAll('.govuk-label').item(5).textContent.trim()).toContain('County/ State/ Province (Optional)');
    expect(element.querySelectorAll('.govuk-label').item(6).textContent.trim()).toContain('Countr');
    expect(element.querySelectorAll('.govuk-label').item(7).textContent.trim()).toContain('Postcode (Optional)');
  });

  it('should check the validity and ensure the errorsPresent is set correctly', () => {
    expect(wrapperComponent.componentUnderTest.errorsPresent).toBeFalsy();

    wrapperComponent.formGroup.get('address').setErrors({ incorrect: true });
    fixture.detectChanges();
    wrapperComponent.componentUnderTest.ngOnChanges();
    expect(wrapperComponent.componentUnderTest.errorsPresent).toBeTruthy();
  });
});
