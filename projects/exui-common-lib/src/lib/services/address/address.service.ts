import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressModel } from '../../models';
import { AddressParser } from './address-parser';
import { AddressType } from './address-type.enum';
import { of } from "rxjs/internal/observable/of";

@Injectable()
export class AddressService {

  constructor(private readonly http: HttpClient) {
  }

  public getAddressesForPostcode(postcode: string): Observable<AddressModel[]> {
    if (!postcode) {
      return of([]);
    }
    return this.http
      .get<any>('/external/addresses?postcode=${postcode}'.replace('${postcode}', postcode), undefined as object)
      .pipe(
        map((res) => res.results))
      .pipe(
        map(output => output ? output.map((addresses: any) =>
          this.format(new AddressParser().parse(addresses[AddressType.DPA]))
        ) : [])
      );
  }

  private format(addressModel: AddressModel) {
    return this.formatAddressLines(this.shiftAddressLinesUp(addressModel));
  }

  private formatAddressLines(addressModel: AddressModel) {
    ['addressLine1', 'addressLine2', 'addressLine3', 'postTown'].forEach((value: keyof typeof addressModel) => {
      addressModel[value] = this.toCapitalCase(addressModel[value]);
    });
    return addressModel;
  }

  private shiftAddressLinesUp(addressModel: AddressModel) {
    if (addressModel.addressLine2 === '') {
      addressModel.addressLine2 = addressModel.addressLine3;
      addressModel.addressLine3 = '';
    }
    if (addressModel.addressLine1 === '') {
      addressModel.addressLine1 = addressModel.addressLine2;
      addressModel.addressLine2 = '';
    }
    return addressModel;
  }

  private toCapitalCase(sentence: string) {
    sentence = sentence.toLowerCase();
    sentence.split(' ').forEach((value) => {
        sentence = sentence.replace(value, value.charAt(0).toUpperCase() + value.substr(1));
      }
    );
    return sentence;
  }
}
