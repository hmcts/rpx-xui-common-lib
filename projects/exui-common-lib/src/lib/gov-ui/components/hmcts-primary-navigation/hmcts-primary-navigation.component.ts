import { Component, Input } from '@angular/core';

@Component({
    selector: 'xuilib-hmcts-primary-navigation',
    templateUrl: './hmcts-primary-navigation.component.html',
    styleUrls: ['./hmcts-primary-navigation.component.scss'],
    standalone: false
})
export class HmctsPrimaryNavigationComponent {

    @Input() public set userLoggedIn(value: any) {
        this.isUserLoggedIn = value;
    }

    @Input() public label: string;
    @Input() public items: {active: boolean, href: string, text: string}[];
    @Input() public isBrandedHeader: boolean;

    public isUserLoggedIn: boolean;
    constructor() {

    }

}
