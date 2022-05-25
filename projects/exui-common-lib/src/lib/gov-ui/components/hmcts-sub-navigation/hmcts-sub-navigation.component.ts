import { Component, Input } from '@angular/core';

@Component({
    selector: 'xuilib-hmcts-sub-navigation',
    templateUrl: './hmcts-sub-navigation.component.html'
})
export class HmctsSubNavigationComponent {
    @Input() public label: string;
    @Input() public items: SubNavigation[];
}

export interface SubNavigation {
    text: string;
    href: string;
    active: boolean;
    total?: number;
}

