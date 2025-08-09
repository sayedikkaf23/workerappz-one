import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl; // The API base URL (from environment)

  constructor(private http: HttpClient) {}

  /**
   * Admin login function.
   * @param loginData The email and password for the admin login.
   * @returns Observable<any> with the response from the backend (JWT or MFA requirement).
   */
  login(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, loginData);
  }

  /**
   * Verify the MFA token provided by the user.
   * @param token The MFA token entered by the user.
   * @returns Observable<any> with the response from the backend (JWT or error).
   */
 verifyMFA(token: string, email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/admin/mfa/verify`, { token, email });
}

  /**
   * Enable MFA for the admin user.
   * @returns Observable<any> with the response from the backend (QR code for scanning).
   */
  enableMFA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mfa/enable`, {});
  }


   getAllIndividualUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/getAllIndividualUsers`);
    // API endpoint should match your Express route
  }

    
  getAllBusinessUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/getAllBusinessUsers`);
    // API endpoint should match your Express route
  }
}
