import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';

@Component({
    selector: 'xuilib-cookie-banner',
    templateUrl: './cookie-banner.component.html'
})

export class CookieBannerComponent implements OnInit {
  @Input() public identifier: string;
  @Input() public appName: string;
  @Output() public notifier = new EventEmitter<any>();

  public isCookieBannerVisible: boolean = false;

  constructor(
    private readonly cookieService: CookieService
  ) {}

  public ngOnInit(): void {
    this.setCookieBannerVisibility();
  }

  public acceptCookie(): void {
    this.cookieService.setCookie(this.identifier, 'true', this.getExpiryDate());
    this.setCookieBannerVisibility();
  }

  public rejectCookie(): void {
    this.cookieService.setCookie(this.identifier, 'false', this.getExpiryDate());
    this.notifyThirdParties();
    this.setCookieBannerVisibility();
  }

  public setCookieBannerVisibility(): void {
    this.isCookieBannerVisible = !this.cookieService.checkCookie(this.identifier);

    if (this.areCookiesRejected()) {
      this.notifyThirdParties();
    }
  }

  public areCookiesRejected(): boolean {
    return this.cookieService.checkCookie(this.identifier) && this.cookieService.getCookie(this.identifier) === 'false';
  }

  public notifyThirdParties(): void {
    this.notifier.emit();
  }

  private getExpiryDate(): string {
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 3600 * 1000 * 24 * 365; // in 365 days
    now.setTime(expireTime);
    return now.toUTCString();
  }

}
