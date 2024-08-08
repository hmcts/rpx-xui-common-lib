import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ServiceMessages } from '../../models/service-message.model';

@Component({
  selector: 'xuilib-service-message',
  templateUrl: './service-message.component.html',
  styleUrls: ['./service-message.component.scss']
})
export class ServiceMessageComponent {
  @Input() public message_en: string;
  @Input() public message_cy?: string;
  @Input() public key: ServiceMessages;
  @Output() public hideMessage = new EventEmitter<ServiceMessages>();
  constructor() { }

  public onHideMessageEvent(key: ServiceMessages) {
    this.hideMessage.emit(key);
  }
}
