import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private apiUrl = environment.apiUrl; 
  private cache: any = null;

  setCachedData(data: any) { this.cache = { ...data }; }
  getCachedData(): any   { return this.cache;    }

  // Step 1 & update full doc
  saveOrUpdateOnboarding(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/onboarding`, data);
  }

  // Step 2 only requirements
  saveRequirements(payload: {
    _id?: string;
    email?: string;
    requirements: 'personal'|'business'|'prepaid'|'transfer';
  }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/onboarding/requirements`,
      payload
    );
  }

  constructor(private http: HttpClient) {}
}
