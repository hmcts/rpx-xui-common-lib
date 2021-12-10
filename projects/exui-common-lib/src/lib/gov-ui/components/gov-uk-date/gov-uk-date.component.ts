import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
export class GovUkDateComponent implements OnInit, AfterViewInit {
  constructor() {
    this.DateValidator100 = this.DateValidator101();
  }

  @ViewChild('form') public form: NgForm;
  @Output() getFormStatus = new EventEmitter();


  @Input() public config: GovUiConfigModel;
  @Input() public config2: GovUiConfigModel;
  // { id: string };
  @Input() public errorMessage: ErrorMessagesModel;
  @Input() public formGroup: any;
  @Input() public DateValidator100: any;

  private x: any;
  private month: any;
  private day: any;
  private year: any;

  public ngOnInit(): void {
    this.x = this.config.id + '_text';
    this.day = this.config.id + '_day';
    this.month = this.config.id + '_month';
    this.year = this.config.id + '_year';


    const dateValidator101 = this.DateValidator101();
    let form: FormGroup = new FormGroup({});
    form.addControl(this.x, new FormControl('', Validators.required));
   // form.addControl(this.month, new FormControl('', dateValidator101));



   this.formGroup.get(this.day).setValidators(dateValidator101);
  //  this.formGroup.get(this.month).setValidators(dateValidator101);
  //  this.formGroup.get(this.year).setValidators(dateValidator101);






    // this.formGroup = this.fb.group({
    //   this.x : new FormControl(null, Validators.required)

    // });




  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.


    this.form.statusChanges.subscribe(res => {

      //this.resetValidationErrorMessages();
      //this.formGroup.updateValueAndValidity();
      //this.formGroup.get(this.month).updateValueAndValidity();

      if (!this.formGroup.valid) {





        //this.getFormStatus.emit({ isInvalid: true, messages: [a+'-'+b+'-'+c] });
        if (!this.formGroup.get(this, this.day).valid) {
         // this.dateValidationErrors.push({ controlId: DateFormControl.BOOKING_START_DAY, documentHRef: this.configStart.id, errorMessage: BookingDateFormErrorMessage.BOOKING_START_DATE_FAILED });
         // this.startDateErrorMessage = { isInvalid: true, messages: [BookingDateFormErrorMessage.BOOKING_START_DATE_FAILED] };
         this.getFormStatus.emit({ isInvalid: true, messages: ['validation_failed'] })
        }
      }else{
        this.getFormStatus.emit(res + "    " + this.form.value[this.month]);
      }


      })
  }

  private isValidDate(d:any, month: number) {
    const dateCheck = d instanceof Date && !isNaN(d.getTime() );
    const leapYearCheck = d.getMonth() == month;
    return dateCheck && leapYearCheck;
  }

  @Input() public DateValidator101(): ValidatorFn {




    let res = (): ValidationErrors | null => {


//debugger;
      const day =this.formGroup.get(this.day).value;
      const month =this.formGroup.get(this.month).value - 1;
      const year =this.formGroup.get(this.year).value;

      const isValid =this.isValidDate(new Date(year, month, day), month);

//debugger;
      if (!isValid) {
        return { isValid: false, errorType: 'ERROR_119' };
      }
      else {
        return;
      }


      // if (this.formGroup.get(this.month).value == 2) {
      //   return { isValid: false, errorType: 'ERROR_119' };
      // }
      // else {
      //   return;
      // }


      // const x= formGroup;
      // if(x==null)
      // {
      //   return { isValid: false, errorType: 'ERROR_119' };
      // }
      // return { isValid: false, errorType: 'ERROR_119' };


      // if (this.form && this.form.value[this.month] == 2) {
      //   return { isValid: false, errorType: 'ERROR_119' };
      // }
      // else {
      //   return;
      // }

    };
    return res;
  }
  // // @dynamic
  //   public static getFormValues(formGroup: AbstractControl) {
  //     // const startDateDay = formGroup.get(DateFormControl.BOOKING_START_DAY).value;
  //     // const startDateMonth = formGroup.get(DateFormControl.BOOKING_START_MONTH).value;
  //     // const startDateYear = formGroup.get(DateFormControl.BOOKING_START_YEAR).value;
  //     // const endDateDay = formGroup.get(DateFormControl.BOOKING_END_DAY).value;
  //     // const endDateMonth = formGroup.get(DateFormControl.BOOKING_END_MONTH).value;
  //     // const endDateYear = formGroup.get(DateFormControl.BOOKING_END_YEAR).value;
  //     // const dateOption = formGroup.get('dateOption').value;
  //     // return {startDateDay, startDateMonth, startDateYear, endDateDay, endDateMonth, endDateYear, dateOption};
  //   }

  //   // public static bookingDateValidator(): ValidatorFn {
  //   //   return (formGroup: AbstractControl): ValidationErrors | null => {
  //   //     const {startDateDay, startDateMonth, startDateYear, endDateDay, endDateMonth, endDateYear, dateOption} =  this.getFormValues(formGroup);
  //   //     if (dateOption !== BookingDateOption.DATERANGE ) {
  //   //         return;
  //   //     }
  //   //     const startDate = new Date(startDateYear, startDateMonth, startDateDay);
  //   //     const endDate = new Date(endDateYear, endDateMonth, endDateDay);
  //   //     if (new Date() > startDate) {
  //   //       return { isValid: false, errorType: BookingDateFormErrorMessage.PAST_DATE_CHECK };
  //   //     }
  //   //     if (!startDateDay  || !startDateMonth  || !startDateYear ||
  //   //       !endDateDay  || !endDateMonth  || !endDateYear ) {
  //   //       return { isValid: true };
  //   //     }
  //   //     if (startDate > endDate) {
  //   //       return { isValid: false, errorType: BookingDateFormErrorMessage.DATE_COMPARISON };
  //   //     }
  //   //     return;
  //   //   };
  //   // }
  // // @dynamic
  //   public static dayValidator(): ValidatorFn {
  //     return (control: AbstractControl): ValidationErrors | null => {
  //       if (control.value === null || control.value === '') { return; }
  //       if (control.value <= 0 || control.value > 31) {
  //         return { isValid : false };
  //       }
  //       return;
  //     };
  //   }

}


export class FeatureToggleService22 {
  // tslint:disable-next-line: variable-name
  public initialize(): void {
    throw new Error('Not implemented');
  }

}
