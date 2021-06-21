import { CookieService } from './cookie.service';

describe('CookieService', () => {
  const mockDocument: any = {
    cookie: ''
  };

  const cookieService: CookieService = new CookieService(mockDocument);

  afterEach(() => {
    mockDocument.cookie = '';
  });

  it('should set a cookie', () => {

    cookieService.setCookie('user', 'dummy');
    expect(mockDocument.cookie).toBe('user=dummy;');
  });

  it('should get a cookie', () => {

    mockDocument.cookie = 'user=dummy';
    const result = cookieService.getCookie('user');
    expect(result).toBe('dummy');
  });

  it('should return true if a cookie exists', () => {

    mockDocument.cookie = 'user=dummy';
    const result = cookieService.checkCookie('user');
    expect(result).toBeTruthy();
  });

  it('should return false if a cookie doesn\'t exists', () => {

    const result = cookieService.checkCookie('user');
    expect(result).toBeFalsy();
  });

  it('should delete a cookie', () => {
    mockDocument.cookie = 'user=dummy';
    const result = cookieService.checkCookie('user');
    expect(result).toBeTruthy();
    cookieService.deleteCookie('user');
    expect(mockDocument.cookie).toBe(`user=; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0`);
  });

  it('should delete a cookie by partial match', () => {
    mockDocument.cookie = 'user_123=dummy';
    const result = cookieService.checkCookie('user_123');
    expect(result).toBeTruthy();
    cookieService.deleteCookieByPartialMatch('user_');
    expect(mockDocument.cookie).toBe(`user_123=; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0`);
  });
});
