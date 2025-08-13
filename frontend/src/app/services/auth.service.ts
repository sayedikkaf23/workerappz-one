import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  get token(): string | null {
    return sessionStorage.getItem('token'); // or localStorage
  }

  logout(): void {
    sessionStorage.removeItem('token');
    // remove anything else you store for auth
    sessionStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
