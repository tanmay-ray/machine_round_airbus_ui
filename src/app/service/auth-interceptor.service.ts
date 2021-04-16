import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = sessionStorage.getItem('jwt');
    if(jwt) {
      req = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${jwt}`)
      });
    }
    
    return next.handle(req);
  }
}
