import { Component, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'xuilib-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  @Input() zIndex: number = 1000;
  @Input() loadingText: string = 'Page can take up to 30 seconds to load';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(document.body, 'loading-spinner-in-action');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'loading-spinner-in-action');
  }
}
