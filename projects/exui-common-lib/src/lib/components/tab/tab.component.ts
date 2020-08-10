import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface TabItem {
    text: string;
}

@Component({
    selector: 'xuilib-tab',
    templateUrl: './tab.component.html'
  })

export class TabComponent implements OnInit {
    @Input() public tabItems: any [];
    @Output() public tabChange = new EventEmitter<void>();
    constructor() {}
    public ngOnInit(): void {
       console.log(this.tabItems);
    }

    public tabChanged(event: any): void {
      this.tabChange.emit(event);
    }
}
