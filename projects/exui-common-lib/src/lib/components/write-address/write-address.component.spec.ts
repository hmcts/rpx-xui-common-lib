import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { WriteAddressFieldComponent } from '..';
import { AddressModel } from '../../models';
import { AddressService } from '../../services';

describe('WriteAddressFieldComponent', () => {

  const ADDRESS_FIELD_LABEL = 'Find Address';
  const POSTCODE = 'P05T CDE';
  const $TITLE = By.css('h2');

  const $POSTCODE_LOOKUP = By.css('.postcodeLookup');
  const $POSTCODE_LOOKUP_INPUT = By.css('.postcodeinput');
  const $POSTCODE_LOOKUP_FIND = By.css('.postcodeLookup > button');
  const $POSTCODE_LOOKUP_ERROR_MESSAGE = By.css('.error-message');

  const $SELECT_ADDRESS = By.css('#selectAddress');
  const $ADDRESS_LIST = By.css('#selectAddress > .addressList');

  const $MANUAL_LINK = By.css('.manual-link');

  @Component({
    selector: `write-address-field`,
    template: `<xuilib-write-address-field [lookupFormControl]="lookupFormControl" [formGroup]="formGroup">
    </xuilib-write-address-field>`
  })
  class WrapperComponent {
    @ViewChild(WriteAddressFieldComponent, /* TODO: add static flag */ {})
    public componentUnderTest: WriteAddressFieldComponent;
    public addressField = new FormControl({});
    public formGroup = addressFormGroup();
    public lookupFormControl = new FormControl({});
  }

  let addressService: AddressService;
  let wrapperComponent: WrapperComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<WrapperComponent>;

  function addressFormGroup() {
    return new FormGroup({
      AddressLine1: new FormControl(),
      AddressLine2: new FormControl(),
      AddressLine3: new FormControl(),
      PostTown: new FormControl(),
      County: new FormControl(),
      PostCode: new FormControl(),
      Country: new FormControl()
    });
  }

  function buildAddress(entryNo: number): AddressModel {
    const address = new AddressModel();
    address.AddressLine1 = `AddressLine1-${entryNo}`;
    address.AddressLine2 = `AddressLine2-${entryNo}`;
    address.AddressLine3 = `AddressLine3-${entryNo}`;
    address.PostTown = `PostTown-${entryNo}`;
    address.County = `County-${entryNo}`;
    address.PostCode = `PostCode-${entryNo}`;
    address.Country = `Country-${entryNo}`;
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

    expect(debugElement.query($TITLE).nativeElement.innerHTML).toEqual(ADDRESS_FIELD_LABEL);
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
    address.AddressLine1 = 'Address Line 1';
    address.AddressLine2 = 'Address Line 2';
    address.AddressLine3 = 'Address Line 3';
    address.PostTown = 'PostTown';
    address.County = 'County';
    address.PostCode = 'PostCode';
    address.Country = 'Country';

    wrapperComponent.addressField = new FormControl(address);
    fixture.detectChanges();

    expect(debugElement.query($TITLE).nativeElement.innerHTML).toEqual(ADDRESS_FIELD_LABEL);
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
    address2.AddressLine2 = '';
    const address3 = buildAddress(3);
    address3.AddressLine3 = '';

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
      'AddressLine1-1, AddressLine2-1, AddressLine3-1, PostTown-1'
    );
    expect(debugElement.query($ADDRESS_LIST).children[2].nativeElement.innerHTML.trim()).toEqual(
      'AddressLine1-2, AddressLine3-2, PostTown-2'
    );
    expect(debugElement.query($ADDRESS_LIST).children[3].nativeElement.innerHTML.trim()).toEqual(
      'AddressLine1-3, AddressLine2-3, PostTown-3'
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

    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.AddressLine1).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.AddressLine2).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.AddressLine3).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.PostTown).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.County).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.PostCode).toEqual('');
    expect(testHostComponent.componentUnderTest.writeComplexFieldComponent.complexGroup.value.Country).toEqual('');

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

});
