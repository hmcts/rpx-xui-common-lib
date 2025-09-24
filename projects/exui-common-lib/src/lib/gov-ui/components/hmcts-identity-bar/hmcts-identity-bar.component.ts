import { Component, Input } from '@angular/core';

@Component({
    selector: 'xuilib-hmcts-identity-bar',
    templateUrl: './hmcts-identity-bar.component.html',
    styleUrls: ['./hmcts-identity-bar.component.scss'],
    standalone: false
})
export class HmctsIdentityBarComponent {

    @Input() public set content(value: any) {
        this.value = value.name;
    }

    public value: string;

    constructor() { }
}
