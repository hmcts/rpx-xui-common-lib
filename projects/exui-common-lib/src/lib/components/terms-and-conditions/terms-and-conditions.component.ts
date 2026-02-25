import { Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TCDocument } from '../../models';

@Component({
    selector: 'xuilib-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss'],
    standalone: false
})
export class TermsAndConditionsComponent {

  @Input() public document: TCDocument;

  constructor(private readonly sanitizer: DomSanitizer) { }

  public sanitizeHtml(content: string | null | undefined): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, content ?? '') ?? '';
  }
}
