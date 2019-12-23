import {Component, Input, OnInit} from '@angular/core';
/*
* Gov UK Date Component
* Responsible for displaying 3 input fields:
* day / month / year
* displaying errorMessage messages
* */
@Component({
  selector: 'xuilib-gov-uk-date',
  templateUrl: './gov-uk-date.component.html'
})
export class GovUkDateComponent implements OnInit {
  constructor() { }
  @Input() public config: { id: string };
  @Input() public errorMessage: {isInvalid: boolean; messages: string[]};
  @Input() public formGroup: any;

  public ngOnInit(): void {
  }
}
