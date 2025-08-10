import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Role {
  _id: string;
  name: string;
  permissions?: string[];
  // add other fields your API returns
}

export interface AdminUser {
  _id: string;
  email: string;
  name?: string;
  roles?: string[];
  // add other fields your API returns
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ===== Auth / MFA you already had =====
  login(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, loginData);
  }

  verifyMFA(token: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mfa/verify`, { token, email });
  }

  enableMFA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mfa/enable`, {});
  }

  // ===== Roles =====
  /** GET /roles/details/:id */
  getRoleById(id: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/roles/details/${id}`);
  }

  /** PUT /roles/update/:id */
  updateRole(id: string, data: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/roles/update/${id}`, data);
  }

  /** DELETE /roles/remove/:id */
  deleteRole(id: string): Observable<{ message?: string }> {
    return this.http.delete<{ message?: string }>(`${this.apiUrl}/roles/remove/${id}`);
  }

  // ===== Admins =====
  /** GET /admins (optionally with pagination/search) */
  getAllAdmins(opts?: { page?: number; limit?: number; search?: string }): Observable<AdminUser[]> {
    let params = new HttpParams();
    if (opts?.page)  params = params.set('page', String(opts.page));
    if (opts?.limit) params = params.set('limit', String(opts.limit));
    if (opts?.search) params = params.set('search', opts.search);
    return this.http.get<AdminUser[]>(`${this.apiUrl}/admins`, { params });
  }

  /** GET /admins/:id */
  getAdminById(id: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiUrl}/admins/${id}`);
  }
}
