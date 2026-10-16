import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorMessagesModel } from 'projects/exui-common-lib/src/public-api';
import {
  primitiveCheckboxes,
  primitivePaginationRecords,
  primitiveRadios,
  primitiveTableRows
} from './primitives-demo.data';

@Component({
  selector: 'app-primitives-demo',
  templateUrl: './primitives-demo.component.html',
  standalone: false
})
export class PrimitivesDemoComponent {
  public readonly form = new FormGroup({
    notes: new FormControl('Original notes'),
    notifications: new FormControl(['sms']),
    urgency: new FormControl('routine'),
    preserved: new FormControl('preserved'),
    disabledField: new FormControl({ value: 'Unavailable value', disabled: true })
  });

  public readonly checkboxes = primitiveCheckboxes;
  public readonly radios = primitiveRadios;
  public readonly tableRows = primitiveTableRows;
  public records = primitivePaginationRecords;
  public readonly paginationId = 'primitives-pagination';
  public currentPage = 1;
  public showPageNumbers = true;
  public showResultCount = true;
  public suppliedErrors = false;
  public identityContent = { name: 'Alex Taylor' };
  public backEventCount = 0;
  public boundsCorrections: number[] = [];

  public suppliedError(message: string): ErrorMessagesModel | null {
    return this.suppliedErrors ? { isInvalid: true, messages: [message] } : null;
  }

  public toggleDisabledControl(): void {
    const control = this.form.get('disabledField');
    if (control.disabled) {
      control.enable();
    } else {
      control.disable();
    }
  }

  public toggleIdentity(): void {
    this.identityContent = this.identityContent.name ? { name: '' } : { name: 'Alex Taylor' };
  }

  public pageChanged(page: number): void {
    this.currentPage = page;
  }

  public pageBoundsCorrected(page: number): void {
    this.currentPage = page;
    this.boundsCorrections.push(page);
  }

  public reduceRecords(): void {
    this.records = this.records.slice(0, 2);
  }

  public togglePaginationDisplays(): void {
    this.showPageNumbers = !this.showPageNumbers;
    this.showResultCount = !this.showResultCount;
  }
}
