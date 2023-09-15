import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { WriteAddressFieldComponent } from '..';
import { AddressModel } from '../../models';
import { AddressService } from '../../services';

describe('WriteAddressFieldComponent', () => {

  const POSTCODE = 'P05T CDE';

  const $POSTCODE_LOOKUP = By.css('.postcodeLookup');
  const $POSTCODE_LOOKUP_INPUT = By.css('.postcodeinput');
  const $POSTCODE_LOOKUP_FIND = By.css('.postcodeLookup > button');
  const $POSTCODE_LOOKUP_ERROR_MESSAGE = By.css('.error-message');

  const $SELECT_ADDRESS = By.css('#selectAddress');
  const $ADDRESS_LIST = By.css('#selectAddress > .addressList');

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
  }

  let addressService: AddressService;
  let wrapperComponent: WrapperComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<WrapperComponent>;

  function addressFormGroup(): FormGroup {
    return new FormGroup({
      addressLine1: new FormControl(),
      addressLine2: new FormControl(),
      addressLine3: new FormControl(),
      postTown: new FormControl(),
      county: new FormControl(),
      postCode: new FormControl(),
      country: new FormControl()
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

  function queryPostcode(postcode: string): void {
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

    /*     expect(debugElement.query($ADDRESS_COMPLEX_FIELD)).toBeTruthy();
        expect(debugElement.query($ADDRESS_COMPLEX_FIELD).nativeElement['hidden']).toBeTruthy(); */

  });

  /*   it('should render only address lines if field is search ', () => {
      wrapperComponent.componentUnderTest.isExpanded = true; // false by default
      fixture.detectChanges();
      expect(debugElement.query($TITLE).nativeElement.innerHTML).toEqual(CASE_FIELD_LABEL);
      expect(debugElement.query($POSTCODE_LOOKUP)).toBeFalsy();
      expect(debugElement.query($SELECT_ADDRESS)).toBeFalsy();
      expect(debugElement.query($MANUAL_LINK)).toBeFalsy();
      expect(debugElement.query($ADDRESS_COMPLEX_FIELD)).toBeTruthy();
      expect(debugElement.query($ADDRESS_COMPLEX_FIELD).nativeElement['hidden']).toBeFalsy();
    }); */

  /* it('should render only title, lookup component and manual link when writeComplexFieldComponent is null', () => {
    wrapperComponent.componentUnderTest.writeComplexFieldComponent = null;
    fixture.detectChanges();
    expect(debugElement.query($TITLE).nativeElement.innerHTML).toEqual(CASE_FIELD_LABEL);
    expect(debugElement.query($POSTCODE_LOOKUP)).toBeTruthy();
    expect(debugElement.query($SELECT_ADDRESS)).toBeFalsy();
    expect(debugElement.query($MANUAL_LINK)).toBeTruthy();

    expect(debugElement.query($ADDRESS_COMPLEX_FIELD)).toBeTruthy();
    expect(debugElement.query($ADDRESS_COMPLEX_FIELD).nativeElement['hidden']).toBeTruthy();

  }); */

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

    /* expect(debugElement.query($ADDRESS_COMPLEX_FIELD)).toBeTruthy();
    expect(debugElement.query($ADDRESS_COMPLEX_FIELD).nativeElement['hidden']).toBeFalsy();

    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value).toEqual(address); */

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

  /* it('should populate the address with the option selected, removing the \'manual link\'', () => {

    const selectedAddress = buildAddress(1);
    wrapperComponent.componentUnderTest.addressList.setValue(selectedAddress);
    wrapperComponent.componentUnderTest.addressSelected();

    fixture.detectChanges();

    expect(debugElement.query($TITLE).nativeElement.innerHTML).toEqual(ADDRESS_FIELD_LABEL);
    expect(debugElement.query($POSTCODE_LOOKUP)).toBeTruthy();
    expect(debugElement.query($SELECT_ADDRESS)).toBeFalsy();
    expect(debugElement.query($MANUAL_LINK)).toBeFalsy();

    expect(debugElement.query($ADDRESS_COMPLEX_FIELD)).toBeTruthy();
    expect(debugElement.query($ADDRESS_COMPLEX_FIELD).nativeElement['hidden']).toBeFalsy();

    expect(wrapperComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value).toEqual(selectedAddress);

  }); */

  /* it('should populate a blank address when the \'manual link\' is clicked', () => {

    fixture.debugElement.query($MANUAL_LINK).nativeElement.dispatchEvent(new Event('click', null));
    fixture.detectChanges();

    expect(debugElement.query($TITLE).nativeElement.innerHTML).toEqual(CASE_FIELD_LABEL);
    expect(debugElement.query($POSTCODE_LOOKUP)).toBeTruthy();
    expect(debugElement.query($SELECT_ADDRESS)).toBeFalsy();
    expect(debugElement.query($MANUAL_LINK)).toBeFalsy();
    expect(debugElement.query($ADDRESS_COMPLEX_FIELD)).toBeTruthy();
    expect(debugElement.query($ADDRESS_COMPLEX_FIELD).nativeElement['hidden']).toBeFalsy();

    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.addressLine1).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.addressLine2).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.addressLine3).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.postTown).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.county).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.postCode).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.country).toEqual('');

  }); */

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

    expect(wrapperComponent.componentUnderTest.ukRadioChecked).toBeFalsy();
    expect(wrapperComponent.componentUnderTest.isInternational).toBeFalsy();

    const noMockEvent = {target: {checked: true, id: 'no'}};
    wrapperComponent.componentUnderTest.setInternationalAddress(noMockEvent);
    fixture.detectChanges();

    expect(wrapperComponent.componentUnderTest.ukRadioChecked).toBeTruthy();
    expect(wrapperComponent.componentUnderTest.isInternational).toBeTruthy();

    const yesMockEvent = {target: {checked: true, id: 'yes'}};
    wrapperComponent.componentUnderTest.setInternationalAddress(yesMockEvent);
    fixture.detectChanges();

    expect(wrapperComponent.componentUnderTest.ukRadioChecked).toBeTruthy();
    expect(wrapperComponent.componentUnderTest.isInternational).toBeFalsy();
  });

});
