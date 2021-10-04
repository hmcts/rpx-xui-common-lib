import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
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
      it('should call assignErrorMessage with the error raised', () => {
          spyOn(errorInterceptor, 'assignErrorMessage');
          const mock404Error = {
            status: 404,
            error: { message: 'not found' }
          };

          const next = {
            handle: () =>  throwError(mock404Error)
          };

          const handleError$ = errorInterceptor.intercept(new HttpRequest('GET', ''), next);

          handleError$.subscribe((res) => {
              console.log(res);
          }, () => {
             expect(errorInterceptor.assignErrorMessage).toHaveBeenCalledWith(mock404Error);
          });
      });

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
