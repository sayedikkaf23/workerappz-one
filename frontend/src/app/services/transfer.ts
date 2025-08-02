import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Transfer {
   url = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  createPayment( createContactData: any ,hashedId :any): Observable<any> {
   

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Auth-User-ID': hashedId, // Add the userHashedId to the header
  });
  
    const url = `${this.url}/funds/addFunds`; // Update the URL with your actual endpoint
  
    return this.http.post(
      url,
      createContactData, // Pass the payload directly to the POST request
      { headers }
    );
  }

  getPaymentData(userId: string,page: number = 1): Observable<any> {

    const headers = new HttpHeaders({
      'X-Auth-User-ID':`${userId}`
    });

    const url = `${this.url}/transactions/getWalletTransactions/${page}`; // Update the URL with your actual endpoint

    // Assuming you're sending an empty body for a POST request
   return this.http.get(url, { headers });
  }
}
