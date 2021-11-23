import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import jsSHA from 'jssha';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const id = '8c6a2bae52a846f498d66613bc831148';
    const key = '7AAJQ-TCZyNafdtJqmQPDrQnAQA';
    const utcString = new Date().toUTCString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(key, 'TEXT');
    ShaObj.update('x-date: ' + utcString);

    const HMAC = ShaObj.getHMAC('B64');
    const contentType = request.headers.get('Content-Type');
    const setHeaders = {
      Authorization: `hmac username="${id}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`,
      'X-Date': utcString,
      'Content-Type': contentType || 'application/json',
    };

    const req = request.clone({
      setHeaders: {
        ...setHeaders,
      },
    });

    return next.handle(req);
  }
}
