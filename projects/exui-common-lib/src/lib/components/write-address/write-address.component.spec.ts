import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AddressModel } from '../../models';
import { AddressService } from '../../services';
import { WriteAddressFieldComponent } from './write-address.component';

describe('WriteAddressFieldComponent', () => {

  const POSTCODE = 'P05T CDE';

  const $POSTCODE_LOOKUP = By.css('.postcode-lookup');
  const $POSTCODE_LOOKUP_INPUT = By.css('.postcodeinput');
  const $POSTCODE_LOOKUP_FIND = By.css('.postcode-lookup > .govuk-body > button');
  const $POSTCODE_LOOKUP_ERROR_MESSAGE = By.css('.govuk-error-message');

  const $SELECT_ADDRESS = By.css('#selectAddress');
  const $ADDRESS_LIST = By.css('#selectAddress > .govuk-body > .addressList');

  const $MANUAL_LINK = By.css('.manual-link');

  @Component({
    selector: `write-address-field`,
    template: `<xuilib-write-address-field [formGroup]="formGroup">
    </xuilib-write-address-field>`
  })
  class WrapperComponent {
    @ViewChild(WriteAddressFieldComponent, /* TODO: add static flag */ {})
    public componentUnderTest: WriteAddressFieldComponent;
    public addressField = new FormControl({});
    public formGroup = addressFormGroup();
    public submissionAttempted = false;
  }

  let addressService: AddressService;
  let wrapperComponent: WrapperComponent;
  let debugElement: DebugElement;
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

  function buildAddress(entryNo: number): AddressModel {
    const address = new AddressModel();
    address.addressLine1 = `addressLine1-${entryNo}`;
    address.addressLine2 = `addressLine2-${entryNo}`;
    address.addressLine3 = `addressLine3-${entryNo}`;
    address.postTown = `postTown-${entryNo}`;
    address.county = `county-${entryNo}`;
    address.postCode = `postCode-${entryNo}`;
    address.country = `country-${entryNo}`;
    return address;
  }

  function queryPostcode(postcode: string) {
    const postcodeField = fixture.debugElement.query($POSTCODE_LOOKUP_INPUT).nativeElement;
    postcodeField.value = postcode;
    postcodeField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    debugElement.query($POSTCODE_LOOKUP_FIND).triggerEventHandler('click', null);
    fixture.detectChanges();
  }

  beforeEach(waitForAsync(() => {

    addressService = new AddressService(null);
    TestBed
      .configureTestingModule({
        imports: [
          ReactiveFormsModule,
        ],
        declarations: [
          WriteAddressFieldComponent,
          WrapperComponent,

        ],
        providers: [
          { provide: AddressService, useValue: addressService }]
      })
      .compileComponents();

    fixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = fixture.componentInstance;
    wrapperComponent.addressField.patchValue(null);

    debugElement = fixture.debugElement;
    fixture.detectChanges();

  }));

  it('should render only title, lookup component and manual link when address not set', () => {

    expect(debugElement.query($POSTCODE_LOOKUP)).toBeTruthy();
    expect(debugElement.query($SELECT_ADDRESS)).toBeFalsy();
    expect(debugElement.query($MANUAL_LINK)).toBeTruthy();

  });

  it('should render only title, lookup component and address when address set', () => {

    const address = new AddressModel();
    address.addressLine1 = 'Address Line 1';
    address.addressLine2 = 'Address Line 2';
    address.addressLine3 = 'Address Line 3';
    address.postTown = 'postTown';
    address.county = 'county';
    address.postCode = 'postCode';
    address.country = 'country';

    wrapperComponent.addressField = new FormControl(address);
    fixture.detectChanges();

    expect(debugElement.query($POSTCODE_LOOKUP)).toBeTruthy();
    expect(debugElement.query($SELECT_ADDRESS)).toBeFalsy();

  });

  it('should render a single option of \'No address found\' when no addresses are returned from AddressService', () => {

    spyOn(addressService, 'getAddressesForPostcode').and.returnValue(of([]));

    queryPostcode(POSTCODE);

    expect(debugElement.query($MANUAL_LINK)).toBeTruthy();
    expect(addressService.getAddressesForPostcode).toHaveBeenCalledWith('P05TCDE');
    expect(debugElement.query($SELECT_ADDRESS)).toBeTruthy();
    expect(debugElement.query($ADDRESS_LIST).children.length).toEqual(1);
    expect(debugElement.query($ADDRESS_LIST).children[0].nativeElement.innerHTML.trim()).toEqual('No address found');

  });

  it('should render a default \'summary item\' and 3 address options when 3 addresses are returned from AddressesService', () => {

    const address2 = buildAddress(2);
    address2.addressLine2 = '';
    const address3 = buildAddress(3);
    address3.addressLine3 = '';

    spyOn(addressService, 'getAddressesForPostcode').and.returnValue(
      of([buildAddress(1), address2, address3])
    );

    queryPostcode(POSTCODE);

    expect(addressService.getAddressesForPostcode).toHaveBeenCalledWith('P05TCDE');
    expect(debugElement.query($MANUAL_LINK)).toBeTruthy();
    expect(debugElement.query($SELECT_ADDRESS)).toBeTruthy();
    expect(debugElement.query($ADDRESS_LIST).children.length).toEqual(4);
    expect(debugElement.query($ADDRESS_LIST).children[0].nativeElement.innerHTML.trim()).toEqual('3 addresses found');

    expect(debugElement.query($ADDRESS_LIST).children[1].nativeElement.innerHTML.trim()).toEqual(
      'addressLine1-1, addressLine2-1, addressLine3-1, postTown-1'
    );
    expect(debugElement.query($ADDRESS_LIST).children[2].nativeElement.innerHTML.trim()).toEqual(
      'addressLine1-2, addressLine3-2, postTown-2'
    );
    expect(debugElement.query($ADDRESS_LIST).children[3].nativeElement.innerHTML.trim()).toEqual(
      'addressLine1-3, addressLine2-3, postTown-3'
    );

  });

  it('should render an error when postcode is blank', () => {

    debugElement.query($POSTCODE_LOOKUP_FIND).triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(debugElement.query($POSTCODE_LOOKUP_ERROR_MESSAGE)).toBeTruthy();

  });

  it('should clear the error when postcode is not blank', () => {

    wrapperComponent.componentUnderTest.missingPostcode = true;
    fixture.detectChanges();

    queryPostcode(POSTCODE);

    expect(debugElement.query($POSTCODE_LOOKUP_ERROR_MESSAGE)).toBeFalsy();

  });

  it('should set the international address fields correctly', () => {

    expect(wrapperComponent.componentUnderTest.isInternational).toBeFalsy();

    wrapperComponent.componentUnderTest.setInternationalAddress(true);
    fixture.detectChanges();

    expect(wrapperComponent.componentUnderTest.isInternational).toBeTruthy();

    wrapperComponent.componentUnderTest.setInternationalAddress(false);
    fixture.detectChanges();

    expect(wrapperComponent.componentUnderTest.isInternational).toBeFalsy();
  });

  it('should emit international mode on blank address click', () => {
    spyOn(wrapperComponent.componentUnderTest.internationalModeStart, 'emit');
    spyOn(wrapperComponent.componentUnderTest.resetSubmission, 'emit');
    wrapperComponent.componentUnderTest.internationalMode = true;
    fixture.detectChanges();
    wrapperComponent.componentUnderTest.blankAddress();

    expect(wrapperComponent.componentUnderTest.internationalModeStart.emit).toHaveBeenCalled();
    expect(wrapperComponent.componentUnderTest.resetSubmission.emit).toHaveBeenCalled();
  });

  it('should correctly set details when address actually selected', () => {
    expect(wrapperComponent.componentUnderTest.addressChosen).toBeFalsy();
    spyOn(wrapperComponent.componentUnderTest.postcodeOptionSelected, 'emit');
    wrapperComponent.componentUnderTest.addressSelected();

    expect(wrapperComponent.componentUnderTest.addressChosen).toBeTruthy();
    expect(wrapperComponent.componentUnderTest.postcodeOptionSelected.emit).toHaveBeenCalled();
    expect(wrapperComponent.componentUnderTest.missingPostcode).toBeFalsy();
  });

  it('should set international address correctly', () => {
    expect(wrapperComponent.componentUnderTest.isInternational).toBeFalsy();
    spyOn(wrapperComponent.componentUnderTest.ukAddressOptionSelected, 'emit');
    wrapperComponent.componentUnderTest.setInternationalAddress(true);

    expect(wrapperComponent.componentUnderTest.isInternational).toBeTruthy();
    expect(wrapperComponent.componentUnderTest.ukAddressOptionSelected.emit).toHaveBeenCalledWith(true);

    wrapperComponent.componentUnderTest.setInternationalAddress(false);

    expect(wrapperComponent.componentUnderTest.isInternational).toBeFalsy();
    expect(wrapperComponent.componentUnderTest.ukAddressOptionSelected.emit).toHaveBeenCalledWith(false);
  });

  it('should determine when postcode error should be present', () => {
    wrapperComponent.componentUnderTest.submissionAttempted = false;
    wrapperComponent.componentUnderTest.addressSelectable = false;
    // postcode field, address not selectable, no submission attempted
    expect(wrapperComponent.componentUnderTest.postcodeErrorPresent(true)).toBeFalsy();

    wrapperComponent.componentUnderTest.submissionAttempted = true;
    // postcode field, address not selectable, submission attempted
    expect(wrapperComponent.componentUnderTest.postcodeErrorPresent(true)).toBeTruthy();

    // select field, address not selectable, submission attempted
    expect(wrapperComponent.componentUnderTest.postcodeErrorPresent(false)).toBeFalsy();

    wrapperComponent.componentUnderTest.addressSelectable = true;
    // select field, address selectable, submission attempted
    expect(wrapperComponent.componentUnderTest.postcodeErrorPresent(false)).toBeTruthy();

    // postcode field, address not selectable, submission attempted
    expect(wrapperComponent.componentUnderTest.postcodeErrorPresent(true)).toBeFalsy();
  });

});
