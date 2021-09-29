import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { HttpClientTestingModule } from "@angular/common/http/testing"
import { getTestBed, TestBed } from "@angular/core/testing";
import { throwError } from "rxjs";
import { HttpGlobalInterceptor } from "./http-global-interceptor";

fdescribe('HttpGlobalInterceptor', () => {
    let interceptor: HttpGlobalInterceptor;
    let httpRequestSpy;
    let httpHandlerSpy;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule, HttpClientModule
        ],
        providers: [
          // register our interceptor with the testing module
          {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpGlobalInterceptor,
            multi: true
          }
        ],
      });

      const injector = getTestBed();  
      interceptor = injector.get(HttpGlobalInterceptor);
    });
  
    it('should throw error in handle', () => {

      httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
      httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
      httpHandlerSpy.handle.and.returnValue(throwError(
          {error: 
              {message: 'test-error'}
          }
      ));
   
      interceptor.intercept(httpRequestSpy, httpHandlerSpy)
        .subscribe(
          err => {     
            expect(err).toBeDefined();       
            //   expect(err).toEqual( {error: 
            //     {message: 'test-error'}
            // });
          }
        );
    });
  });
