import { Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceMessages } from '../../models/service-message.model';

@Component({
    selector: 'xuilib-service-message',
    templateUrl: './service-message.component.html',
    styleUrls: ['./service-message.component.scss'],
    standalone: false
})
export class ServiceMessageComponent {
  @Input() public message_en: string;
  @Input() public message_cy?: string;
  @Input() public key: ServiceMessages;
  @Output() public hideMessage = new EventEmitter<ServiceMessages>();
  constructor(private sanitizer: DomSanitizer) { }

  public onHideMessageEvent(key: ServiceMessages) {
    this.hideMessage.emit(key);
  }

  public sanitizeHtml(content: string | null | undefined): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, content ?? '') ?? '';
  }
}
