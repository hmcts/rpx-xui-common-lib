import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { HttpGlobalInterceptor } from './http-global-interceptor';

const testUrl = '/data';
interface Data {
    name: string;
}

describe('HttpGlobalInterceptor', () => {
  describe('intercept', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          HttpGlobalInterceptor
        ],
        imports: [HttpClientTestingModule]
      });

      httpClient = TestBed.get(HttpClient);
      httpMock = TestBed.get(HttpTestingController);
    });

    it('When 401, user is automatically logged out and error is rethrow', () => {
      const emsg = 'deliberate 401 error';
      httpClient.get<Data>(testUrl).subscribe(
          () => fail('should have failed with the 401 error'),
          (error: HttpErrorResponse) => {
            expect(error.status).toEqual(401, 'status');
            expect(error.error).toEqual(emsg, 'message');
          }
      );

      const req = httpMock.expectOne(testUrl);
      req.flush(emsg, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
