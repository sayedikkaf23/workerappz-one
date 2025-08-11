import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Types ---
export interface TransactionLimitDto {
  cashLimit: number;
  bankLimit: number;
}

export interface CreditLimitDto {
  limit: number;
}
@Injectable({
  providedIn: 'root'
})
export class LimitService {
  private apiUrl = environment.apiUrl; // Ensure this URL points to your backend API

  constructor(private http: HttpClient) {}

  // Fetch Global Transaction Limit
  getTransactionLimit(): Observable<TransactionLimitDto> {
    return this.http.get<TransactionLimitDto>(`${this.apiUrl}/limit/transaction-limit`);
  }

  // Update Global Transaction Limit
  updateTransactionLimit(payload: TransactionLimitDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/limit/transaction-limit`, payload);
  }

  getCreditLimit(): Observable<CreditLimitDto> {
    return this.http.get<CreditLimitDto>(`${this.apiUrl}/limit/credit-limit`);
  }

  // Update Global Credit Limit
  updateCreditLimit(payload: CreditLimitDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/limit/credit-limit`, payload);
  }
}

