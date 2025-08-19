import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) Attach token if present
    const token = this.auth.token;
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      // 2) Some backends return 200 with {resCode:401}, catch that too
      tap(event => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body && body.resCode === 401) {
            this.kickToLogin();
          }
        }
      }),
      // 3) Standard 401/403 handling
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.kickToLogin();
        }
        return throwError(() => err);
      })
    );
  }

  private kickToLogin() {
    this.auth.logout();
    // optional: add return URL
    this.router.navigate(['/admin/login'], { queryParams: { from: this.router.url } });
  }
}
