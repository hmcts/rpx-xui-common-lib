import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpGlobalInterceptor } from './http-global-interceptor';

describe('HttpGlobalInterceptor', () => {
    let errorInterceptor: HttpGlobalInterceptor;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          HttpGlobalInterceptor
        ],
        imports: [HttpClientTestingModule]
      });

      errorInterceptor = new HttpGlobalInterceptor();
    });

    describe('Error test', () => {
      it('Should return value off error message server side error', () => {
        const serverErrorMessage = 'serverSide Error';
        const mockError = {
          message: serverErrorMessage
        } as HttpErrorResponse;

        const result = errorInterceptor.assignErrorMessage(mockError);
        expect(result).toEqual(serverErrorMessage);
      });

      it('Should return value off error message client side error', () => {
        const clientErrorMessage = 'clientSide Error';
        const eventEvent = { message: clientErrorMessage } as ErrorEvent;

        const mockError: HttpErrorResponse = {
          error: eventEvent as ErrorEvent
        } as HttpErrorResponse;

        const result = errorInterceptor.assignErrorMessage(mockError);
        expect(result).toEqual(clientErrorMessage);
      });
    });
 });
