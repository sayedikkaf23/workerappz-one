import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Contact {
   url = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  // Activate Currency
  
  getCard(userID:string): Observable<any> {
    const subAccountUrl = `${this.url}/user/getCard/${userID}`;
  
 
    return this.http.get(subAccountUrl);
  
  
  
  }

  getallCategories(): Observable<any> {
    const subAccountUrl = `${this.url}/enumerations/getallCategories`;
  
 
    return this.http.get(subAccountUrl);
  
  
  
  }
  blockCard(userCardId:any): Observable<any> {
    const subAccountUrl = `${this.url}/card/deleteCard/${userCardId}`;
  
 
    return this.http.delete(subAccountUrl);
  
  
  
  }


  unblockCard(userCardId: any): Observable<any> {
    const subAccountUrl = `${this.url}/card/UnsuspendCardWithId`;
    return this.http.post(subAccountUrl, { id: userCardId });
  }
  

  getSubaccount( userToken: string,userId:string): Observable<any> {
    const subAccountUrl = `${this.url}/user/getAllSubaccount/${userId}`;
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    });
  
    const payload = {}; // Replace with your actual payload
  
    return this.http.post(subAccountUrl, payload, { headers });
  }


  activateConact(contactId: string, userToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    });

    const url = `https://staging-dev.fyorin.com/api/payments/contacts/${contactId}/activate`;

    return this.http.post(
      url,
      null, // if you don't have a payload, you can pass null or an empty object
      { headers }
    );
  }

  createContact(generatedId: string, userToken: string, createContactData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    });
  
    const url = `${this.url}/user/${generatedId}/createContact`; // Update the URL with your actual endpoint
  
    return this.http.post(
      url,
      createContactData, // Pass the payload directly to the POST request
      { headers }
    );
  }
  addcard(createCardData: any): Observable<any> {
  
    const url = `${this.url}/user/addcard`; // Update the URL with your actual endpoint
  
    return this.http.post(
      url,
      createCardData, // Pass the payload directly to the POST request
    
    );
  }
  getCvv(reqbody: any): Observable<any> {
  
    const url = `${this.url}/user/getCardCVV`; // Update the URL with your actual endpoint
  
    return this.http.post(
      url,
      reqbody, // Pass the payload directly to the POST request
    
    );
  }
  createNewFundCategory(createCardData: any): Observable<any> {
  
    const url = `${this.url}/funds/createCategory`; // Update the URL with your actual endpoint
  
    return this.http.post(
      url,
      createCardData, // Pass the payload directly to the POST request
    
    );
  }
}
