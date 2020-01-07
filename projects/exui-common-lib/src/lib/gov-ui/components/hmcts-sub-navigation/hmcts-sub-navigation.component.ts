import {Component, Input} from '@angular/core';

@Component({
    selector: 'xuilib-hmcts-sub-navigation',
    templateUrl: './hmcts-sub-navigation.component.html',
    styleUrls: ['./hmcts-sub-navigation.component.scss']
})
export class HmctsSubNavigationComponent {

    @Input() public label: string;
    @Input() public items: SubNavigation[];

    constructor() { }

}

export interface SubNavigation {
    text: string;
    href: string;
    active: boolean;
}

