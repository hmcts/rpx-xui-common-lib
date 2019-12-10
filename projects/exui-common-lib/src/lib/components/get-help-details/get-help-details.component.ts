import { Component, Input } from '@angular/core';
import { GetHelpDetailsDataModel } from '../../models';

@Component({
    selector: 'xuilib-get-help-details',
    templateUrl: './get-help-details.component.html',
    styleUrls: ['get-help-details.component.scss']
})
export class GetHelpDetailsComponent {

    @Input() public data: GetHelpDetailsDataModel;

    constructor() {
    }
}
