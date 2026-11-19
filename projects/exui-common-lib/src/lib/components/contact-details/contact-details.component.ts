import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ContactDetailsDataModel } from '../../models';

@Component({
    selector: 'xuilib-contact-details',
    templateUrl: './contact-details.component.html',
    styleUrls: ['contact-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContactDetailsComponent {

    @Input() public data: ContactDetailsDataModel;

    constructor() {
    }
}
