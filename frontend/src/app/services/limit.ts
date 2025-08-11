// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment';

// // --- Types ---
// export interface TransactionLimitDto {
//   cashLimit: number;
//   bankLimit: number;
// }

// export interface CreditLimitDto {
//   limit: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class LimitService {  // <-- Ensure this class is named correctly
//   private apiUrl = environment.apiUrl;

//   constructor(private http: HttpClient) {}

//   // Fetch Global Transaction Limit
//   getTransactionLimit(): Observable<TransactionLimitDto> {
//     return this.http.get<TransactionLimitDto>(`${this.apiUrl}/transaction-limit`);
//   }

//   // Update Global Transaction Limit
//   updateTransactionLimit(payload: TransactionLimitDto): Observable<any> {
//     return this.http.put(`${this.apiUrl}/transaction-limit`, payload);
//   }

//   // Fetch Global Credit Limit
//   getCreditLimit(): Observable<CreditLimitDto> {
//     return this.http.get<CreditLimitDto>(`${this.apiUrl}/credit-limit`);
//   }

//   // Update Global Credit Limit
//   updateCreditLimit(payload: CreditLimitDto): Observable<any> {
//     return this.http.put(`${this.apiUrl}/credit-limit`, payload);
//   }
// }
