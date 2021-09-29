import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { getTestBed, TestBed } from "@angular/core/testing";
import { HttpGlobalInterceptor } from "./http-global-interceptor";

fdescribe('HttpGlobalInterceptor', () => {
    let client: HttpClient
    let controller: HttpTestingController
  
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
      client = injector.get(HttpClient);    
      controller = injector.get(HttpTestingController);
    });
  
    it('should throw error in handle', (done) => {
        expect(client).not.toBeUndefined();
        expect(controller).not.toBeUndefined();    
           done();
    });
  });