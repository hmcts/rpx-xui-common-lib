import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressModel } from '../../models';
import { AddressParser } from './address-parser';
import { AddressType } from './address-type.enum';

@Injectable()
export class AddressService {

  constructor(private readonly http: HttpClient) {
  }

  public getAddressesForPostcode(postcode: string): Observable<AddressModel[]> {
    return this.http
      .get<any>('/external/addresses?postcode=${postcode}'.replace('${postcode}', postcode), undefined as object)
      .pipe(
        map((res) => res.results))
      .pipe(
        map(output => output.map((addresses: any) =>
          this.format(new AddressParser().parse(addresses[AddressType.DPA]))
        ))
      );
  }

  private format(addressModel: AddressModel) {
    return this.formatAddressLines(this.shiftAddressLinesUp(addressModel));
  }

  private formatAddressLines(addressModel: AddressModel) {
    ['AddressLine1', 'AddressLine2', 'AddressLine3', 'PostTown'].forEach((value: keyof typeof addressModel) => {
      addressModel[value] = this.toCapitalCase(addressModel[value]);
    });
    return addressModel;
  }

  private shiftAddressLinesUp(addressModel: AddressModel) {
    if (addressModel.AddressLine2 === '') {
      addressModel.AddressLine2 = addressModel.AddressLine3;
      addressModel.AddressLine3 = '';
    }
    if (addressModel.AddressLine1 === '') {
      addressModel.AddressLine1 = addressModel.AddressLine2;
      addressModel.AddressLine2 = '';
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
