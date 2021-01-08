import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'xuilib-service-message',
  templateUrl: './service-message.component.html'
})
export class ServiceMessageComponent {
  @Input() public message: string;
  @Input() public key: string;
  @Output() public hideMessage = new EventEmitter<string>();
  constructor() { }

  public onHideMessageEvent(key: string) {
    this.hideMessage.emit(key);
  }
}
