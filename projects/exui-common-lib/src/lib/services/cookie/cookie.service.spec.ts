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
    expect(mockDocument.cookie).toBe(`user=; expires=${new Date(0)}`);
  });
});
