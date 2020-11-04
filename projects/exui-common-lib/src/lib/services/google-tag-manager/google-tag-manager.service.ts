import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { windowToken } from '../../window';

@Injectable({
  providedIn: 'root'
})
export class GoogleTagManagerService {
  private readonly document: Document;
  private readonly window: Window;

  public googleTagManagerKey: string;
  constructor(
    private readonly router: Router,
    private readonly title: Title,
    @Inject(windowToken) window: any,
    @Inject(DOCUMENT) document: any
  ) {
    this.window = window as Window;
    this.document = document as Document;
  }

  public init(googleTagManagerKey: string) {
    this.googleTagManagerKey = googleTagManagerKey;
    try {
      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${this.googleTagManagerKey}`;
      this.document.head.appendChild(script);

      const script2 = this.document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js',
        });
        gtag('config', '${this.googleTagManagerKey}', {'send_page_view': false});
      `;
      this.document.head.appendChild(script2);

    } catch (ex) {
      console.error('Error appending google tag manager');
      console.error(ex);
    }
    this.listenForRouteChanges();
  }

  private listenForRouteChanges() {
    if (this.googleTagManagerKey) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (this.window as any).gtag('config', this.googleTagManagerKey, {
            page_path: event.urlAfterRedirects,
            page_title: this.title.getTitle(),
          });
        }
      });
    }
  }

  public event(eventName: string, params: {}) {
    (this.window as any).gtag('event', eventName, params);
  }
}
