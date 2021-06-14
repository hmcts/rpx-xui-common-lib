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

  public deleteCookie(key: string): void {
    this.document.cookie = `${key}=; path=/; expires=${new Date(0)}`;
  }

  public deleteCookieByPartialMatch(key: string): void {
    this.document.cookie
      .split('; ')
      .filter(row => row.startsWith(`${key}`))
      .forEach(element => {
        this.deleteCookie(element.split('=')[0]);
      });
  }

  public checkCookie(key: string): boolean {
    return this.document.cookie.split(';').some(item => item.trim().startsWith(`${key}=`));
  }
}
