// src/app/roles/roles.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  AdminService,           // ✅ use AdminService, not Admin
  CreateRoleDto,
  UpdateRoleDto,
  Role
} from '../services/admin.service';

@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.html',
  styleUrls: ['./roles.css'] // plural
})
export class Roles implements OnInit {
  // form fields
  roleName = '';
  status = true;
  selectedPermissions: string[] = [];

  // state
  isLoading = false;
  isEdit = false;
  id: string | null = null;

  allPermissions: string[] = [
    'Dashboard',
    'Individual User',
    'Business User',
    'Category',
    'Wallet',
    'Customer Transfer Fund',
    'Card',
    'Transfer History',
    'Customer Purchase Transaction History',
    'Settings',
  ];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      // Prefer router state if you navigated with { state: { role } }
      const fromState = history.state?.role as Role | undefined;
      if (fromState) {
        this.fillForm(fromState);
      } else {
        this.loadRole(this.id);
      }
    }
  }

  private loadRole(id: string) {
    this.isLoading = true;
    this.adminService.getRoleById(id).subscribe({
      next: (role) => { this.fillForm(role); this.isLoading = false; },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err?.error?.message || 'Failed to load role', 'Error');
        this.router.navigate(['admin/roles/view']);
      }
    });
  }

  private fillForm(role: Role) {
    this.roleName = role.role_name || '';
    this.status = !!role.status;
    this.selectedPermissions = Array.isArray(role.permissions) ? [...role.permissions] : [];
  }

  onPermissionChange(event: any) {
    const permission = event.target.value;
    const checked = !!event.target.checked;
    if (checked && !this.selectedPermissions.includes(permission)) {
      this.selectedPermissions.push(permission);
    } else if (!checked) {
      this.selectedPermissions = this.selectedPermissions.filter(p => p !== permission);
    }
  }

  goBack() {
    this.router.navigate(['admin/roles/view']); // adjust to your list route if different
  }

  onSubmit() {
    if (!this.roleName.trim()) {
      this.toastr.warning('Role name is required', 'Validation');
      return;
    }

    const base = {
      role_name: this.roleName.trim().toLowerCase(),
      permissions: this.selectedPermissions,
      status: this.status,
    };

    this.isLoading = true;

    if (this.isEdit && this.id) {
      // UPDATE
      const payload: UpdateRoleDto = { ...base };
      this.adminService.updateRole(this.id, payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success(res?.message || 'Role updated successfully', 'Updated');
          this.router.navigate(['admin/roles/view']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err?.error?.message || 'Failed to update role', 'Error');
        }
      });
    } else {
      // CREATE
      const payload: CreateRoleDto = { ...base };
      this.adminService.createRole(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastr.success(res?.message || 'Role created successfully', 'Success');
          // reset form if you stay on the page
          this.roleName = '';
          this.selectedPermissions = [];
          this.status = true;
          // or go back to list
          this.router.navigate(['admin/roles/view']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err?.error?.message || 'Failed to create role', 'Error');
        }
      });
    }
  }
}
