import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  url = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/admin/admins`, {});
  }
  getAdminById(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/admins/${id}`, {});
  }
  /**
   * Get transaction history from /transaction/history
   * @param email optional filter by 'from' or 'to'
   * @param page default 1
   * @param limit default 10
   */
  getTransactionHistory(
    email?: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    // Build query string
    let queryString = `?page=${page}&limit=${limit}`;
    if (email) {
      queryString += `&email=${email}`;
    }

    // Example GET: /api/transaction/history?email=abc@example.com&page=1&limit=10
    return this.http.get<any>(
      `${this.url}/admin/transaction/history${queryString}`
    );
  }
  fetchTransactionHistoryByPartnerCode(
    partnerCode: any,
    email?: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    // Build query string
    let queryString = `?page=${page}&limit=${limit}`;
    if (email) {
      queryString += `&email=${email}`;
    }
    if (partnerCode) {
      queryString += `&partnerCode=${partnerCode}`;
    }
    // Example GET: /api/transaction/history?email=abc@example.com&page=1&limit=10
    return this.http.get<any>(
      `${this.url}/admin/transaction/history${queryString}`
    );
  }

  adminLogin(credentials: any): Observable<any> {
    console.log('📤 Sending login API call...');
    return this.http.post(`${environment.apiUrl}/admin/Login`, credentials);
  }

  getAllUsers(value: string): Observable<any> {
    return this.http.get(`${this.url}/admin/getalluser?partnercode=${value}`);
  }
  getAllBusinessUsers(value: string): Observable<any> {
    return this.http.get(
      `${this.url}/admin/getAllBusinessUsers?partnercode=${value}`
    );
  }
  getallCategories(): Observable<any> {
    return this.http.get(`${this.url}/enumerations/getallCategories`);
  }
  getAllUserWallets(page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${this.url}/admin/getAllUserWallets?page=${page}&limit=${limit}`
    );
  }

  searchUserWallets(
    partnerCode: string | null,
    search: string,
    startDate: string | null,
    endDate: string | null,
    page: number,
    limit: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('partnerCode', partnerCode || '')
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<any>(`${this.url}/admin/getAllUserWallets`, {
      params,
    });
  }
  getUserWalletsByPartnerCode(
    partnerCode: string,
    page: number,
    limit: number
  ): Observable<any> {
    return this.http.get<any>(
      `${this.url}/admin/getAllUserWallets?partnerCode=${partnerCode}&page=${page}&limit=${limit}`
    );
  }

  getAllroles(): Observable<any> {
    return this.http.get(`${this.url}/admin/roles`);
  }
  getAllPanterCode(): Observable<any> {
    return this.http.get(`${this.url}/admin/partnerCode`);
  }

  getAllClients(): Observable<any> {
    return this.http.get(`${this.url}/admin/allClients`);
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/roles`);
  }
  deletePanterCode(id: string): Observable<any> {
    return this.http.delete(`${this.url}/admin/panter-codes/${id}`);
  }
  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.url}/admin/role/${id}`);
  }
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.url}/admin/${id}`);
  }
  getPanterCode(): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/partnerCode`);
  }

  Premisson(id: string): Observable<any> {
    return this.http.get<any>(`${this.url}/admin/${id}`);
  }

  listSearchUsersByEmail(email: string): Observable<any> {
    return this.http.get<any>(
      `${this.url}/user/listSearchUsers?email=${email}`
    );
  }

  updateUser(data: any): Observable<any> {
    const userHashedId = localStorage.getItem('userHashedId'); // Get adminHashedId from localStorage
    const headers = new HttpHeaders({
      'X-Auth-User-ID': userHashedId || '',
      'Content-Type': 'application/json',
      Authorization: 'Bearer <token>', // Replace <token> with actual token logic if required
    });

    return this.http.put<any>(`${this.url}/user/UpdateUser`, data, { headers });
  }

  createRole(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/role`, payload);
  }
  updateRole(payload: any, id: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/role/${id}`, payload);
  }

  topUp(payload: any): Observable<any> {
    let headers = new HttpHeaders(); // Initialize headers

    // Get AdminRole from localStorage
    const adminRole = localStorage.getItem('AdminRole');
    const adminHashedId = localStorage.getItem('adminHashedId'); // Assuming this is stored

    console.log(adminHashedId, adminRole, 'adminRole');

    // Add the header properly
    if (adminRole === 'administrator' && adminHashedId) {
      headers = headers.set('X-Auth-User-ID', adminHashedId); // Correct way to set headers
      console.log('Headers after setting:', headers);
    }

    return this.http.post(`${environment.apiUrl}/admin/topUp`, payload, {
      headers,
    });
  }

  masterTopUp(payload: any): Observable<any> {
    let headers = new HttpHeaders(); // Initialize headers

    // Get AdminRole from localStorage
    const adminRole = localStorage.getItem('fromAdminRole');
    const adminHashedId = localStorage.getItem('fromUserHashedId');

    console.log(adminHashedId, adminRole, 'adminRole');

    // Add the header properly
    if (adminRole === 'administrator' && adminHashedId) {
      headers = headers.set('X-Auth-User-ID', adminHashedId); // Correct way to set headers
      console.log('Headers after setting:', headers);
    }

    return this.http.post(`${environment.apiUrl}/admin/mastertopup`, payload, {
      headers,
    });
  }

  addPanterCode(
    partnerCode: string,
    status: string,
    companyname: string
  ): Observable<any> {
    const payload = { partnerCode, status, companyname };
    return this.http.post(`${environment.apiUrl}/admin/panter-codes`, payload);
  }
  // In admin.service.ts

  updatePanterCode(
    id: string,
    partnerCode: string,
    status: string,
    companyname: string
  ): Observable<any> {
    const payload = { partnerCode, status, companyname };
    return this.http.put(
      `${environment.apiUrl}/admin/panter-codes/${id}`,
      payload
    );
  }

  registerAdmin(adminData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/register`, adminData);
  }
  updateAdmin(adminData: any, id: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/${id}`, adminData);
  }

  getActiveBusinessUsers(): Observable<any> {
    const adminHashedId = localStorage.getItem('adminHashedId'); // Get adminHashedId from localStorage
    const headers = new HttpHeaders({
      'X-Auth-User-ID': adminHashedId || '',
      Authorization: 'Bearer <token>', // Replace <token> with the actual token
    });

    return this.http.get<any>(`${this.url}/businesses/getActiveBusinessUsers`, {
      headers,
    });
  }

  getSearchUsers(email: string): Observable<any> {
    const adminHashedId = localStorage.getItem('userHashedId'); // Get adminHashedId from localStorage
    const headers = new HttpHeaders({
      'X-Auth-User-ID': adminHashedId || '',
      Authorization: 'Bearer <token>', // Replace <token> with the actual token
    });

    // Build the endpoint dynamically using the provided email.
    const endpoint = `${this.url}/user/listSearchUsers?email=${email}`;

    return this.http.get<any>(endpoint, { headers });
  }

  updateBusiness(data: any): Observable<any> {
    const adminHashedId = localStorage.getItem('adminHashedId'); // Get adminHashedId from localStorage
    const headers = new HttpHeaders({
      'X-Auth-User-ID': adminHashedId || '',
      'Content-Type': 'application/json',
      Authorization: 'Bearer <token>', // Replace <token> with your actual token logic if required
    });

    return this.http.put<any>(`${this.url}/businesses/updateBusiness`, data, {
      headers,
    });
  }

  getAllUser(): Observable<any> {
    return this.http.get<any>(`${this.url}/user/getUserCards`);
  }
  loadUsersByPartnerCode(partnerCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/user/getUserCards?partnerCode=${partnerCode}`
    );
  }
  getAllClient(): Observable<any> {
    return this.http.get<any>(`${this.url}/user/getAllClient`);
  }
  getAllClientByPartnerCode(partnerCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/user/getAllClient?partnerCode=${partnerCode}`
    );
  }

  getCompanyNameByPartnerCode(partnerCode: any): Observable<any> {
    return this.http.get<any>(
      `${this.url}/admin/getCompanyName/${partnerCode}`
    );
  }

  getAllUsersTransactionsHistory(
    partnerCode?: string,
    page: number = 1,
    limit: number = 6
  ): Observable<any> {
    // Build the query string using the provided parameters
    let queryString = `?page=${page}&limit=${limit}`;
    if (partnerCode) {
      queryString += `&partnerCode=${partnerCode}`;
    }
    // Call the API endpoint using HttpClient GET
    return this.http.get<any>(
      `${this.url}/admin/getAllUsersTransactionsHistory${queryString}`
    );
  }

  getAllIpAddresses(): Observable<any> {
    return this.http.get<any>(`${this.url}/macAddress/mac-addresses`);
  }
  addIpAddress(data: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.url}/macAddress/mac-addresses`, data, {
      headers,
    });
  }

  updateIpAddress(id: string, data: any): Observable<any> {
    return this.http.put<any>(
      `${this.url}/macAddress/mac-addresses/${id}`,
      data
    );
  }
  deleteIpAddress(id: string): Observable<any> {
    return this.http.delete(`${this.url}/macAddress/mac-addresses/${id}`);
  }
  verifyOTP(otp: string): Observable<any> {
    return this.http.post(`${this.url}/admin/PostOtp`, { otp });
  }
}
