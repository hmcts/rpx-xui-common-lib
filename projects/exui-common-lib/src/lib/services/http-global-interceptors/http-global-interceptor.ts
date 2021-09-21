import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class HttpGlobalInterceptor implements HttpInterceptor {
  public intercept(
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
          errorMessage = error.message;
        }
        return throwError(errorMessage);
      })
    ) as Observable<HttpEvent<any>>;
  }
}
