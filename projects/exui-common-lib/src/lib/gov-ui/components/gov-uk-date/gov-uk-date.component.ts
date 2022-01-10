import {Component, Input, OnInit} from '@angular/core';
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
  constructor() { }
  @Input() public config: GovUiConfigModel;
  // { id: string };
  @Input() public errorMessage: ErrorMessagesModel;
  @Input() public formGroup: any;

  public ngOnInit(): void {
  }
}
