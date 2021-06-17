import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CookieService } from '../../services/cookie/cookie.service';
import { windowToken } from '../../window';

@Component({
    selector: 'xuilib-cookie-banner',
    templateUrl: './cookie-banner.component.html'
})

export class CookieBannerComponent implements OnInit {
  @Input() public identifier: string;
  @Input() public appName: string;
  @Output() public rejectionNotifier = new EventEmitter<any>();
  @Output() public acceptanceNotifier = new EventEmitter<any>();

  public isCookieBannerVisible: boolean = false;
  private readonly window: Window;

  constructor(
    private readonly cookieService: CookieService,
    @Inject(windowToken) window: any,
  ) {
    this.window = window as Window;
  }

  public ngOnInit(): void {
    this.setState();
  }

  public acceptCookie(): void {
    this.cookieService.setCookie(this.identifier, 'true', this.getExpiryDate());
    this.setState(true);
  }

  public rejectCookie(): void {
    this.cookieService.setCookie(this.identifier, 'false', this.getExpiryDate());
    this.setState(true);
  }

  public setState(reload: boolean = false): void {
    this.isCookieBannerVisible = !this.cookieService.checkCookie(this.identifier);

    if (this.areCookiesAccepted()) {
      this.notifyAcceptance();
    } else {
      this.notifyRejection();
    }

    if (reload) { // reload if any of the buttons are pressed
      this.window.location.reload();
    }
  }

  public areCookiesAccepted(): boolean {
    return this.cookieService.checkCookie(this.identifier) && this.cookieService.getCookie(this.identifier) === 'true';
  }

  public notifyRejection(): void {
    this.rejectionNotifier.emit();
  }

  public notifyAcceptance(): void {
    this.acceptanceNotifier.emit();
  }

  private getExpiryDate(): string {
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 31536000000;  //  in 365 days = 3600 * 1000 * 24 * 365
    now.setTime(expireTime);
    return now.toUTCString();
  }

}
