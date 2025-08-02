import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Dashboard {
   url = environment.apiUrl;

  constructor(private http: HttpClient) {}
    
  
 

  getAllIndividualAndBusinessUsers(partnerCode:any): Observable<any> {
    const endpointUrl = `${this.url}/admin/getAllIndividualUsers?partnerCode=${partnerCode}`;
    return this.http.get(endpointUrl);
  }
  fetchUserCountsPartnercode(partnerCode:any): Observable<any> {
    const endpointUrl = `${this.url}/admin/getAllIndividualUsers?partnerCode=${partnerCode}`;
    return this.http.get(endpointUrl);
  }
  getCreditPrefundCredit(): Observable<any> {
    const endpointUrl = `${this.url}/restricted/getCreditPrefundCredit/${environment.apikey}`;
    return this.http.get(endpointUrl);
  }

  // New method to get credit prefund balance
  getCreditPrefundBalance(): Observable<any> {
    const endpointUrl = `${this.url}/restricted/getCreditPrefundBalance/${environment.apikey}`;
    return this.http.get(endpointUrl);
  }
  getAdditionalMasterData(pantercode: any, adminid: any): Observable<any> {
    const endpointUrl = `${this.url}/admin/financial/${pantercode}/${adminid}`;
    return this.http.get(endpointUrl);
  }
  
}
