import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hmcts-primary-navigation',
    templateUrl: './hmcts-primary-navigation.component.html',
    styleUrls: ['./hmcts-primary-navigation.component.scss']
})
export class HmctsPrimaryNavigationComponent {

    @Input() public set userLoggedIn(value: any) {
        this.isUserLoggedIn = value;
    }

    @Input() public label: string;
    @Input() public items: object[];

    public isUserLoggedIn: boolean;
    constructor() {

    }

}
