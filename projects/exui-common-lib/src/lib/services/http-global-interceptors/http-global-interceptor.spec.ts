import { HttpErrorResponse } from '@angular/common/http';
import {HttpClientTestingModule } from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import { throwError } from 'rxjs';
import {HttpGlobalInterceptor} from './http-global-interceptor';

fdescribe('HttpGlobalInterceptor', () => {
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

    it('should auto logout if 401 response returned from api', () => {
        //arrange
      
        // const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
        // httpHandlerSpy.handle.and.returnValue({
        //     pipe: () => {
        //       done();
        //     // return fakeAsyncResponseWithError({});
        //     }
        // });

        const response = {
          status: 404,
          error: { message: 'not found' }
        } as HttpErrorResponse;

        const next = {       
          handle: () => throwError(response)
        };

        //act
        errorInterceptor.intercept(null, next).subscribe(
          result => console.log('good', result), 
          err => {
            console.log('ex-log', err);
            expect(err.message).toEqual('not found');
          });
    });
 });
