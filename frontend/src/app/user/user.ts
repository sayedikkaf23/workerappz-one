// src/app/user/user.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, CreateAdminDto, UpdateAdminDto } from '../services/admin.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {
  roles: any[] = [];
  filteredRoles: any[] = [];
  searchTerm = '';

  // Modal state
  showCreateModal = false;
  showEditModal = false;

  // Forms (template-driven via ngModel)
  newAdmin: CreateAdminDto = {
    email: '',
    password: '',
    roleid: '',
    status: true,
  };

  editAdminData: any = null; // we’ll store the selected admin here

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchAdmins();
  }

  fetchAdmins(): void {
    this.adminService.getAllAdmins().subscribe({
      next: (admins) => {
        this.roles = admins || [];
        this.filteredRoles = [...this.roles];
      },
      error: (err) => {
        console.error('getAllAdmins error:', err);
        Swal.fire('Error', 'Failed to load admins', 'error');
      },
    });
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredRoles = [...this.roles];
      return;
    }
    this.filteredRoles = this.roles.filter(
      (u) =>
        u.email?.toLowerCase().includes(term) ||
        u.partnerCode?.toLowerCase().includes(term) ||
        u.role?.role_name?.toLowerCase().includes(term)
    );
  }

  exportToExcel(): void {
    const data = this.filteredRoles.map((u, i) => ({
      No: i + 1,
      Email: u.email,
      'Role Name': u.role?.role_name || 'N/A',
      
      'Updated On': new Date(u.updatedAt).toLocaleString(),
      
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  }

  // ---- Open/close modals
  openCreateModal() {
    this.router.navigate(['/admin/add/admin']);
  }
  closeCreateModal() { this.showCreateModal = false; }

  openEditModal(role: any) {
    this.editAdminData = { ...role }; // shallow copy
    this.showEditModal = true;
  }
  closeEditModal() { this.showEditModal = false; }

  // ---- Create admin
  saveNewAdmin() {
    if (!this.newAdmin.email || !this.newAdmin.password) {
      Swal.fire('Validation', 'Email and Password are required', 'warning');
      return;
    }
    this.adminService.createAdmin(this.newAdmin).subscribe({
      next: () => {
        Swal.fire('Success', 'Admin created', 'success');
        this.closeCreateModal();
        this.fetchAdmins();
      },
      error: (err) => {
        console.error('createAdmin error:', err);
        Swal.fire('Error', err?.error?.message || 'Failed to create admin', 'error');
      },
    });
  }

  // ---- Update admin
  saveEditAdmin() {
    const id = this.editAdminData?._id || this.editAdminData?.id;
    if (!id) return;

    const payload: UpdateAdminDto = {
      email: this.editAdminData.email,
      
      roleid: this.editAdminData.roleid || this.editAdminData.role?._id,
      status: this.editAdminData.status,
    };

    this.adminService.updateAdmin(id, payload).subscribe({
      next: () => {
        Swal.fire('Updated', 'Admin updated successfully', 'success');
        this.closeEditModal();
        this.fetchAdmins();
      },
      error: (err) => {
        console.error('updateAdmin error:', err);
        Swal.fire('Error', err?.error?.message || 'Failed to update admin', 'error');
      },
    });
  }

  // ---- Delete admin
  deleteRole(role: any): void {
    const id = role?._id || role?.id;
    if (!id) return;

    if (role.email === 'admin@gmail.com') {
      Swal.fire('Not allowed', 'You cannot delete this admin', 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'This admin will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Admin deleted.', 'success');
            this.fetchAdmins();
          },
          error: (err) => {
            console.error('deleteAdmin error:', err);
            Swal.fire('Error', err?.error?.message || 'Failed to delete admin', 'error');
          },
        });
      }
    });
  }

  // Existing helpers
  toggleStatus(role: any) { role.isActive = !role.isActive; }

  toggleDropdown(role: any) {
    this.roles.forEach((r) => (r.showDropdown = false));
    role.showDropdown = !role.showDropdown;
  }

 // user.ts
editUser(role: any, e?: MouseEvent) {
  e?.stopPropagation();
  this.router.navigate(['/admin/admins', role._id, 'edit']);
  role.showDropdown = false;
}

  editRole(role: any) { this.openEditModal(role); }

  viewRole(role: any) { console.log('View role:', role); }

  trackByRoleName(index: number, role: any) {
    return role._id || role.email || index;
  }
}
