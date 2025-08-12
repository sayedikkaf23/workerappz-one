import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// --- Types ---
export interface ServiceItem {
  _id: string;
  name: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateServiceDto {
  name: string;
  active?: boolean; // default true if omitted
}
export interface UpdateServiceDto {
  name?: string;
  active?: boolean;
}

export interface Role {
  _id: string;
  role_name: string;
  permissions: string[];
  status: boolean;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  role_name: string;
  permissions: string[]; // send array
  status?: boolean;
}

export interface UpdateRoleDto {
  role_name?: string;
  permissions?: string[];
  status?: boolean;
}
export interface CreateAdminDto {
  email: string;
  password: string;
    roleid?: string;
  status?: boolean;

  
}

export interface UpdateAdminDto {
  email?: string;
  password?: string;   // <— add this
  roleid?: string;
  status?: boolean;
}


@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(loginData: { email: string; password: string,auth_Code:string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, loginData);
  }

  verifyMFA(token: string, email: string ): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mfa/verify`, { token, email });
  }

  enableMFA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/mfa/enable`, {});
  }

  getAllIndividualUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/getAllIndividualUsers`);
  }

  getAllBusinessUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/getAllBusinessUsers`);
  }
  
getAllAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/admins`);
  }

  createAdmin(payload: CreateAdminDto): Observable<any> {
    // If your backend uses /admin/register, change the URL below:
    return this.http.post(`${this.apiUrl}/admin/register`, payload);
  }

updateAdmin(id: string, payload: UpdateAdminDto): Observable<any> {
  return this.http.put(`${this.apiUrl}/admin/admin/${id}`, payload); // or `/admin/${id}` if you cleaned routes
}

  deleteAdmin(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/admin/${id}`);
  }
//   // src/app/services/admin.service.ts (add this)
// getRoles(): Observable<any[]> {
//   // adjust path if your API differs (e.g., /role, /api/roles, etc.)
//   return this.http.get<any[]>(`${this.apiUrl}/admin/roles`);
// }

// admin.service.ts
getAdminById(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/admins/${id}`); // ensure backend route exists
}

 getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/admin/roles`);
  }

  
  createRole(payload: CreateRoleDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/roles/create`, payload);
  }

  updateRole(id: string, payload: UpdateRoleDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/roles/update/${id}`, payload);
  }

  // Get Service by ID
getServiceById(id: string): Observable<ServiceItem> {
  return this.http.get<ServiceItem>(`${this.apiUrl}/service/details/${id}`);
}

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/roles/remove/${id}`);
  }

  listServices(): Observable<ServiceItem[]> {
  return this.http.get<ServiceItem[]>(`${this.apiUrl}/service/list`);
}
createService(payload: CreateServiceDto): Observable<any> {
  return this.http.post(`${this.apiUrl}/service/add`, payload);
}
updateService(id: string, payload: UpdateServiceDto): Observable<any> {
  return this.http.put(`${this.apiUrl}/service/update/${id}`, payload);
}
deleteService(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/service/remove/${id}`);
}
// src/app/services/admin.service.ts
getRoleById(id: string): Observable<Role> {
  // adjust path if your roles router is mounted differently
  return this.http.get<Role>(`${this.apiUrl}/admin/roles/details/${id}`);
}
  getCurrencies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/get-currencies`);
  }

  // Create new currency
  createCurrency(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/add-currency`, data);
  }

}
