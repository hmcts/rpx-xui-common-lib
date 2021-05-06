import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  private _document?: Document;

  constructor(@Inject(DOCUMENT) document?: any) {
    this._document = document as Document;
  }

  public setCookie(key: string, value: string, expiryDate?: string): void {
    const expiry = expiryDate ? ` expires=${expiryDate}` : '';
    const cookie = `${key}=${value};${expiry}`;
    this._document.cookie = cookie;
  }

  public getCookie(key: string): string {
    const cookieValue = this._document.cookie
      .split('; ')
      .find(row => row.startsWith(`${key}=`))
      .split('=')[1];
    return cookieValue;
  }

  public deleteCookie(key: string): void {
    this._document.cookie = `${key}=; expires=${new Date(0)}`;
  }

  public checkCookie(key: string): boolean {
    return this._document.cookie.split(';').some(item => item.trim().startsWith(`${key}=`));
  }
}
