import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { windowToken } from '../../window';

@Injectable({
  providedIn: 'root'
})

export class GoogleAnalyticsService {

  private readonly document: Document;
  private readonly window: Window;

  public googleAnalyticsKey: string;
  constructor(
    private readonly router: Router,
    private readonly title: Title,
    @Inject(windowToken) window: any,
    @Inject(DOCUMENT) document: any,
  ) {
    this.window = window as Window;
    this.document = document as Document;

  }

  public init(googleAnalyticsKey: string) {
    this.googleAnalyticsKey = googleAnalyticsKey;
    try {
      const script1 = this.document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${this.googleAnalyticsKey}`;
      this.document.head.appendChild(script1);

      const script2 = this.document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${this.googleAnalyticsKey}', {'send_page_view': false});
      `;
      this.document.head.appendChild(script2);
    } catch (ex) {
      console.error('Error appending google analytics');
      console.error(ex);
    }
    this.listenForRouteChanges();
  }

  private listenForRouteChanges() {
    if (this.googleAnalyticsKey) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (this.window as any).gtag('config', this.googleAnalyticsKey, {
            page_path: event.urlAfterRedirects,
            page_title: this.title.getTitle(),
          });
        }
      });
    }
  }

  public event(eventName: string, params: Record<string, any>) {
    if (typeof (window as any).gtag === 'function') {
      (this.window as any).gtag('event', eventName, params);
    } else {
      console.warn('Google Analytics is not available.');
    }
  }
}
