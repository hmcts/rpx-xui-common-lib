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

      (this.window as any).dataLayer = (this.window as any).dataLayer || [];
      (this.window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });

      const script = this.document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${this.googleTagManagerKey}`;
      this.document.head.appendChild(script);

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
          (this.window as any).dataLayer.push({
            event: 'pageview',
            page: {
              path: event.urlAfterRedirects,
              title: this.title.getTitle()
            }
          });
        }
      });
    }
  }

  public event(eventName: string, params: {}) {
    (this.window as any).dataLayer.push({
      event: eventName,
      params
    });
  }
}
