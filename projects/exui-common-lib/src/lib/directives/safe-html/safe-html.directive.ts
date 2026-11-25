import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';
import DOMPurify from 'dompurify';

@Directive({
  selector: '[xuilibSafeHtml]',
  standalone: false
})
export class SafeHtmlDirective implements OnChanges {
  @Input() public xuilibSafeHtml: string | null | undefined;

  private readonly allowedAttributes = [
    'aria-label',
    'class',
    'href',
    'rel',
    'target',
    'title'
  ];

  private readonly allowedTags = [
    'a',
    'b',
    'br',
    'div',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'li',
    'ol',
    'p',
    'span',
    'strong',
    'u',
    'ul'
  ];

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  public ngOnChanges(): void {
    this.clearContent();

    if (!this.xuilibSafeHtml) {
      return;
    }

    // DOMPurify is the primary XSS sanitisation boundary.
    const sanitizedContent = DOMPurify.sanitize(this.xuilibSafeHtml, {
      ALLOWED_ATTR: this.allowedAttributes,
      ALLOWED_TAGS: this.allowedTags
    });

    const parsedDocument = new DOMParser().parseFromString(
      sanitizedContent,
      'text/html'
    );

    Array.from(parsedDocument.body.childNodes).forEach((node) => {
      this.renderer.appendChild(
        this.elementRef.nativeElement,
        this.createSafeNode(node)
      );
    });
  }

  private clearContent(): void {
    const element = this.elementRef.nativeElement;

    while (element.firstChild) {
      this.renderer.removeChild(element, element.firstChild);
    }
  }

  /**
   * Rebuild the DOM instead of assigning sanitized content to innerHTML.
   *
   * DOMPurify performs the security sanitisation. Rebuilding the DOM also
   * avoids introducing another innerHTML sink that security tooling may flag.
   */
  private createSafeNode(node: Node): Node {
    if (node.nodeType === Node.TEXT_NODE) {
      return this.renderer.createText(node.textContent ?? '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return this.renderer.createText('');
    }

    const sourceElement = node as HTMLElement;
    const tagName = sourceElement.tagName.toLowerCase();

    if (!this.allowedTags.includes(tagName)) {
      return this.createSafeFragment(sourceElement);
    }

    const safeElement = this.renderer.createElement(tagName);

    Array.from(sourceElement.attributes).forEach((attribute) => {
      if (!this.allowedAttributes.includes(attribute.name.toLowerCase())) {
        return;
      }

      this.renderer.setAttribute(
        safeElement,
        attribute.name,
        attribute.value
      );
    });

    // Defence in depth for links opened in a new browsing context.
    if (
      tagName === 'a' &&
      safeElement.getAttribute('target')?.toLowerCase() === '_blank'
    ) {
      this.renderer.setAttribute(
        safeElement,
        'rel',
        'noopener noreferrer'
      );
    }

    Array.from(sourceElement.childNodes).forEach((childNode) => {
      this.renderer.appendChild(
        safeElement,
        this.createSafeNode(childNode)
      );
    });

    return safeElement;
  }

  private createSafeFragment(element: HTMLElement): DocumentFragment {
    const fragment = this.document.createDocumentFragment();

    Array.from(element.childNodes).forEach((childNode) => {
      fragment.appendChild(this.createSafeNode(childNode));
    });

    return fragment;
  }
}
