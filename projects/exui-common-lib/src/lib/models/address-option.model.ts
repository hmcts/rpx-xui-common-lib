import { AddressModel } from '.';

export class AddressOption {
  public description: string;
  public value: AddressModel;

  constructor (addressModel: AddressModel, description: string) {
    if (description === null) {
      this.value = addressModel;
      this.description = this.getDescription();
    } else {
      this.description = description;
    }
  }

  private getDescription(): string {
    return this.removeInitialCommaIfPresent(
      `${this.value.addressLine1 === undefined ? '' : this.value.addressLine1}${this.prefixWithCommaIfPresent(this.value.addressLine2)}${this.prefixWithCommaIfPresent(this.value.addressLine3)}, ${this.value.postTown}`
    );
  }

  private prefixWithCommaIfPresent(value: string): string {
    return value ? `, ${value}` : value;
  }

  private removeInitialCommaIfPresent(value: string): string {
    return value.replace(new RegExp('^,', 'gi'), '');
  }
}
