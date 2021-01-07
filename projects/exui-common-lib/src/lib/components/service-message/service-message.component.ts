import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xuilib-service-message',
  templateUrl: './service-message.component.html'
})
export class ServiceMessageComponent {
  @Input() public message: string;
  @Input() public key: string;
  @Output() onHideMessage = new EventEmitter<string>();
  constructor() { }

  public onHideMessageEvent(key: string) {
    this.onHideMessage.emit(key);
  }
}
