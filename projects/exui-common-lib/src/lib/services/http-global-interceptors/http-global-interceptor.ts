import {
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { Injectable } from '@angular/core';
  
  @Injectable()
  export class HttpGlobalInterceptor implements HttpInterceptor {
    constructor() {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = error.error.message;
          } else {
            // server-side error
            errorMessage =error.message;
          }
          return throwError(errorMessage);
        })
      ) as Observable<HttpEvent<any>>;
    }
  }
  