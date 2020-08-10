import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface TabItem {
    text: string;
}

@Component({
    selector: 'xuilib-tab',
    templateUrl: './tab.component.html'
  })

export class TabComponent {
    @Input() public tabItems: any [];
    @Output() public tabChange = new EventEmitter<void>();
    constructor() {}

    public tabChanged(event: any): void {
      this.tabChange.emit(event);
    }
}
