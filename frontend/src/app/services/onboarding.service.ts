import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private apiUrl = environment.apiUrl;
  private cache: any = null;
  constructor(private http: HttpClient) {}

  setCachedData(data: any) {
    this.cache = { ...data };
  }
  getCachedData(): any {
    return this.cache;
  }

  // Step 1 & update full doc
  saveOrUpdateOnboarding(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/onboarding`, data);
  }

  // Step 2 only requirements
  saveRequirements(payload: {
    _id?: string;
    email?: string;
    requirements: 'personal' | 'business' | 'prepaid' | 'transfer';
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/onboarding/requirements`,
      payload
    );
  }
  getNationalities(): Observable<{ value: string; label: string }[]> {
    return this.http.get<{ value: string; label: string }[]>(
      `${this.apiUrl}/nationalities/country-risk`
    );
  }

    getPresignedUrl(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Add the file to the form data
  
    // Send the POST request with FormData
    return this.http.post(`${this.apiUrl}/api/upload-file`, formData);
  }

    addOrUpdateUploadedFiles(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/onboarding/addFiles`, payload);
  }

   getOnboardingDetailsByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}/api/onboarding/getDetails`, { params });
  }
  
}
