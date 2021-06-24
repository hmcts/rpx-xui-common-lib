import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  private readonly document?: Document;

  constructor(@Inject(DOCUMENT) doc?: any) {
    this.document = doc as Document;
  }

  public setCookie(key: string, value: string, expiryDate?: string): void {
    const expiry = expiryDate ? ` expires=${expiryDate}` : '';
    const cookie = `${key}=${value};${expiry}`;
    this.document.cookie = cookie;
  }

  public getCookie(key: string): string {
    const cookieValue = this.document.cookie
      .split('; ')
      .find(row => row.startsWith(`${key}=`))
      .split('=')[1];
    return cookieValue;
  }

  public deleteCookie(key: string, path?: string, domain?: string): void {
    const pathValue = path ? `; path=${path}` : '';
    const domainValue = domain ? `; domain=${domain}` : '';
    this.document.cookie = `${key}=${pathValue}${domainValue}; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0`;
  }

  public deleteCookieByPartialMatch(key: string, path?: string, domain?: string): void {
    this.document.cookie
      .split('; ')
      .filter(row => row.startsWith(`${key}`))
      .forEach(element => {
        this.deleteCookie(element.split('=')[0], path, domain);
      });
  }

  public checkCookie(key: string): boolean {
    return this.document.cookie.split('; ').some(item => item.trim().startsWith(`${key}=`));
  }
}
