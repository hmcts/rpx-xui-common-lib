import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AddressService } from './address.service';

describe('AddressService', () => {

  let addressService: AddressService;
  let httpClient: any;
  const validPostCode = 'SW1A 2AA';
  let injector: TestBed;
  const validPostCodeResults: any = require('./postcode-test/valid-postcode-results.json');

  beforeEach(() => {

    httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    const postCodeResponse = validPostCodeResults;
    httpClient.get.and.returnValue(of(postCodeResponse));
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService, {
        provide: HttpClient,
        useValue: httpClient
      }]
    });
    injector = getTestBed();
    addressService = injector.get(AddressService);
  });

  it('should be created with all the dependencies', () => {
    expect(addressService).toBeTruthy();
  });

  it('should return least one addresses from a given postcode', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => { expect(addresses.length).toBeGreaterThan(1);});
  });

  it('should return all addresses from a given postcode location', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => { expect(addresses.length).toEqual(20);});
  });

  it('should return addresses with either addressLine1 or addressLine2 populated', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => {
      expect(
        addresses[0].AddressLine1.length > 0  || addresses[0].AddressLine2.length > 0
      ).toBe(true);
    });
  });

  it('should return addresses without null or undefined values ', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => {
      expect(addresses[0].AddressLine1).not.toContain('undefined');
      expect(addresses[0].AddressLine1).not.toContain('null');
      expect(addresses[0].AddressLine2).not.toContain('undefined');
      expect(addresses[0].AddressLine2).not.toContain('null');
    });

  });

  it('should return addresses with postcode value', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => { expect(addresses[0].PostCode.length).toBeGreaterThan(0);});
  });

  it('should return subscriber error when postcode service returns zero', () => {
    httpClient.get.and.returnValue(of([]));
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => expect(addresses.length).toBe(1),
                     error => expect(error).toBeTruthy());
  });

  it('should shift address lines above when there is no address line 1', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => {
      expect(
        addresses[1].AddressLine1
      ).toBeTruthy();
    });
  });

  it('should expect both addressLine1 and addressLine2 populated', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => {
      expect(
        addresses[0].AddressLine1
      ).toBeTruthy();
      expect(
        addresses[0].AddressLine2
      ).toBeTruthy();
    });
  });

  it('should expect addressLine1 and addressLine2 to be in capital case', () => {
    const result = addressService.getAddressesForPostcode(validPostCode);
    result.subscribe(addresses => {
      expect(isAddressLineInCapitalCase(addresses[0].AddressLine1)).toBe(true);
      expect(isAddressLineInCapitalCase(addresses[0].AddressLine2)).toBe(true);
    });
  });

  function isAddressLineInCapitalCase(addressLine: string) {
    let result = true;
    addressLine.split(' ').forEach(word => {
        if (!isInCapitalCase(word)) {
          result = false;
        }
    });
    return result;
  }

  function isInCapitalCase(word: string) {
    return () => {
      const uppCase = word.charAt(0) === word.charAt(0).toUpperCase();
      const lowCase = word.charAt(1) === word.charAt(1).toLowerCase();
      return (uppCase && lowCase);
    };
  }

});
