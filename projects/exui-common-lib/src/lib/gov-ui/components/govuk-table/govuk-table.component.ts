import {formatDate} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-govuk-table',
    templateUrl: './govuk-table.component.html',
    styleUrls: ['./govuk-table.component.scss']
})
export class GovukTableComponent {

    @Input() public classes = '';
    @Input() public caption = 'Dates and amounts';
    @Input() public firstCellIsHeader = true;
    @Input() public rows: any;
    @Input() public columnConfig: GovukTableColumnConfig[] = [
        { header: 'Date', key: 'date', type: 'text' },
        { header: 'Amount', key: 'amount' }
    ];

    constructor() { }

    public formatDate(date: Date): string {
        return formatDate(date, 'dd/MM/yyyy', 'en-UK');
    }

}

export class GovukTableColumnConfig {
    public header: string;
    public key: string;
    public type?: string;
    constructor() {
        this.header = '';
        this.key = '';
        this.type = 'text';
    }
  }
