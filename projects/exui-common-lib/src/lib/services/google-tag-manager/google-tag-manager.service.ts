import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { CSP_NONCE } from '@angular/core'; // <-- important
import { windowToken } from '../../window';

@Injectable({ providedIn: 'root' })
export class GoogleTagManagerService {
  private readonly document: Document;
  private readonly window: Window;
  private loaded = false;

  public googleTagManagerKey = '';

  constructor(
    private readonly router: Router,
    private readonly title: Title,
    @Inject(windowToken) win: any,
    @Inject(DOCUMENT) doc: any,
    // note: the application of nonce is a safeguard, this should be handled by application
    @Optional() @Inject(CSP_NONCE) private readonly cspNonce?: string
  ) {
    this.window = win as Window;
    this.document = doc as Document;
  }

  /** Call this only AFTER the user has opted-in to analytics cookies */
  public init(googleTagManagerKey: string) {
    console.log('Initializing Google Tag Manager');
    if (this.loaded || !googleTagManagerKey) return;
    this.loaded = true;
    this.googleTagManagerKey = googleTagManagerKey;

    try {
      // 1) dataLayer bootstrap (executes as app code, not inline <script>)
      (this.window as any).dataLayer = (this.window as any).dataLayer || [];
      (this.window as any).dataLayer.push({
        'gtm.start': Date.now(),
        event: 'gtm.js'
      });

      // 2) nonced external loader
      const script = this.document.createElement('script');
      script.async = true;
      if (this.cspNonce) {
        console.log('Applying CSP nonce to GTM script');
        script.setAttribute('nonce', this.cspNonce);
      }
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(this.googleTagManagerKey)}`;
      script.addEventListener('error', (e) => {
        // helpful to see CSP blocks in user consoles
        // eslint-disable-next-line no-console
        console.warn('[GTM] loader error', e);
      });
      this.document.head.appendChild(script);
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error('Error appending Google Tag Manager', ex);
    }

    this.listenForRouteChanges();
  }

  private listenForRouteChanges() {
    if (!this.googleTagManagerKey) return;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        (this.window as any).dataLayer?.push({
          event: 'pageview',
          page: {
            path: event.urlAfterRedirects,
            title: this.title.getTitle()
          }
        });
      }
    });
  }

  public virtualPageView(eventName: string, path: string, title: string, metadata?: Record<string, any>) {
    (this.window as any).dataLayer?.push({ event: eventName, page: { path, title }, ...metadata });
  }

  public event(eventName: string, params: Record<string, any>) {
    (this.window as any).dataLayer?.push({ event: eventName, ...params });
  }
}
