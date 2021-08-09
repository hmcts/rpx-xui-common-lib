import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[xuilibManageLinkToggle]'
})
export class ManageLinkToggleDirective implements OnInit {
  @Input() public hidden: boolean = true;

  constructor(private readonly element: ElementRef) {
  }

  public ngOnInit(): void {
    const host = this.element.nativeElement as HTMLElement;
    if (this.hidden) {
      host.style.display = 'none';
    }
  }
}
