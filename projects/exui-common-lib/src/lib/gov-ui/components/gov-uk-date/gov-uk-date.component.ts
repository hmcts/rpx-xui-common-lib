import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorMessagesModel } from '../../models/error-messages-model';
import { GovUiConfigModel } from '../../models/gov-ui-config-model';
/*
 * Gov UK Date Component
 * Responsible for displaying 3 input fields:
 * day / month / year
 * displaying errorMessage messages
 * */
@Component({
  selector: 'xuilib-gov-uk-date',
  templateUrl: './gov-uk-date.component.html',
  styleUrls: ['./gov-uk-date.component.scss']
})
export class GovUkDateComponent implements OnInit {
  constructor() {}
  @Input() public config: GovUiConfigModel;
  @Input() public errorMessage: ErrorMessagesModel;
  @Input() public formGroup: any;

  public month: any;
  public day: any;
  public year: any;

  public ngOnInit(): void {
    this.day = `${this.config.id}_day`;
    this.month = `${this.config.id}_month`;
    this.year = `${this.config.id}_year`;
    const dateValidator = this.DateValidator();
    this.formGroup.get(this.day).setValidators(dateValidator);
  }

  private isValidDate(d: any, month: number): boolean {
    const dateCheck = d instanceof Date && !isNaN(d.getTime());
    const leapYearCheck = d.getMonth() === month;
    return dateCheck && leapYearCheck;
  }

  public DateValidator(): ValidatorFn {
    const res = (): ValidationErrors | null => {
      const day = this.formGroup.get(this.day).value;
      const month = this.formGroup.get(this.month).value - 1;
      const year = this.formGroup.get(this.year).value;
      const isValid = this.isValidDate(new Date(year, month, day), month);
      return !isValid ? { dateComponent: true } : null;
    };
    return res;
  }
}
