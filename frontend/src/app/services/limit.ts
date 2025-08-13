import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class LimitService {
  private apiUrl = environment.apiUrl; // Ensure this URL points to your backend API

  constructor(private http: HttpClient) {}

    getCreditLimit(): Observable<any> {
  const token = sessionStorage.getItem('token'); // or localStorage if that's where you store it

  return this.http.get<any>(`${this.apiUrl}/limit/credit-limit`, {
          headers: { 'Content-Type': 'application/json' }

  });
}

  // Fetch Global Transaction Limit
// globalTransactionLimit(payload: any) {
//   const token = sessionStorage.getItem('token'); // or localStorage if you store it there

//   return this.http.post(`${this.apiUrl}/limit/transaction-limit`, payload, {
//     headers: new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     })
//   });
// }

 updateTransactionLimit(payload: any): Observable<any> {
  const token = sessionStorage.getItem('token'); // or localStorage if stored there

  return this.http.put(`${this.apiUrl}/limit/transaction-limit`, payload, {
          headers: { 'Content-Type': 'application/json' }

  });
}



  // Update Global Credit Limit
  // globalCreditLimit(payload: any): Observable<any> {
  // const token = sessionStorage.getItem('token'); // or localStorage.getItem('token')

  // return this.http.post(`${this.apiUrl}/limit/credit-limit`, payload, {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   })
  // });
}


