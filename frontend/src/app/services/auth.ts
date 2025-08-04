import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
   url = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  // User Signup
  customerSignup(payload: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/user/signup`,
      payload
    );
  }
  partialSignup(payload: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/user/partialSignup`,
      payload
    );
  }
  updateAddress(payload: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/user/updateAddress`,
      payload
    );
  }

  // User Login
  customerLogin(credentials: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/user/login`,
      credentials
    );
  }
  processKyc(credentials: any): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/admin/processAuthenticationDocuments`,
      credentials
    );
  }
  getUserDetails(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/user-details/${userId}`);
  }
  checkaccount(userId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/check-account-approved/${userId}`);
  }
  checkEmailAlready(email: string,userId?: string): Observable<any> {
    const body = userId ? { email, userId } : { email };
    return this.http.post(`${environment.apiUrl}/user/checkEmailAlready`, { email });
  }
  checkContactAlready(userId?: string): Observable<any> {

    return this.http.post(`${environment.apiUrl}/user/checkContactAlready`, { userId });
  }
  ApproveSubAccount(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/toggleApproval`, { email });
  }

  deleteUser(userHashedId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/user/deleteUser/${userHashedId}`);
  }
  
  ApproveCreateContact(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/toggleApprovalCreatContact`, { email });
  }
  ApproveCurrency(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/toggleApprovalCurrency`, { email });
  }
  verifyOTP(otp: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/PostOtp`, { otp });
  }
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/forgotPassword`, { email });
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.url}/user/resetPassword`, { token, newPassword });
  }

  getEmails(): Observable<any> {
    return this.http.get(`${this.url}/user/get-emails`);
  }
  authkyc(): Observable<any> {
    return this.http.get(`${this.url}/admin/authkyc`);
  }
  getShareHolder(email: string): Observable<any> {
    return this.http.get(`${this.url}/user/getShareHolderData/${email}`);
  }
  addShareHolder(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.url}/user/addShareHolder`, data);
  }

  getAllowedTitles(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getAllowedTitles`);
  }

  getAllowedCountries(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getAllowedCountries`);
  }
  getAllowedNationalities(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getAllowedNationalities`);
  }
  getAllowedCountriesCode(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getAllowedMobileCountryCodes`);
  }
  getKYCDocumentTypes(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getKYCDocumentTypes`);
  }
  getKYCIDTypes(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getKYCTypes`);
  }
  getKYCIDTypesD(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getKYCIDTypes`);
  }
  getKYCIDTypesDBusiness(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getBusinessIdTypes`);
  }
  getBusinessDcumentTypes(): Observable<any> {
    return this.http.get<any>(`${this.url}/enumerations/getBusinessDcumentTypes`);
  }

  getPanterCode(): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/partnerCode`);
  }
  getAllpartner(): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/getAllpartner`);
  }
  skipUserApproval(userHashedId: any): Observable<any> {
    return this.http.patch<any>(`${this.url}/user/skipUserApproval/${userHashedId}`, {});
  }
  
  
}
