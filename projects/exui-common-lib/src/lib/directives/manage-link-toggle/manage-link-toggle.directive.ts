import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[xuilibManageLinkToggle]'
})
export class ManageLinkToggleDirective {
  @Input() public invisible: boolean = true;

  constructor(private readonly element: ElementRef) {
    const host = this.element.nativeElement as HTMLElement;
    if (this.invisible) {
      host.style.display = 'none';
    }
  }
}
