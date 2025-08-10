// add-admin.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-add-admin',
  standalone: false,
  templateUrl: './add-admin.html',
  styleUrls: ['./add-admin.css']
})
export class AddAdmin implements OnInit {
  // form fields
  email = '';
  password = '';     // optional in edit
  roleid = '';
  status: boolean = true;

  roles: any[] = [];
  isLoading = false;

  // edit mode
  isEdit = false;
  adminId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadRoles();

    this.adminId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.adminId;

    if (this.isEdit && this.adminId) {
      this.fetchAdmin(this.adminId);
    }
  }

  loadRoles() {
    this.adminService.getRoles().subscribe({
      next: roles => this.roles = roles || [],
      error: err => Swal.fire('Error', 'Failed to load roles', 'error')
    });
  }

  fetchAdmin(id: string) {
    this.isLoading = true;
    this.adminService.getAdminById(id).subscribe({
      next: admin => {
        this.email  = admin.email;
        this.roleid = admin.role?._id || admin.roleid || '';
        this.status = !!admin.status;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load admin', 'error');
      }
    });
  }

  onSubmit() {
    if (!this.email || !this.roleid) {
      Swal.fire('Validation', 'Email and Role are required', 'warning');
      return;
    }

    if (this.isEdit && this.adminId) {
      // UPDATE
      const payload: any = { email: this.email, roleid: this.roleid, status: this.status };
      if (this.password) payload.password = this.password; // only send if filled

      this.isLoading = true;
      this.adminService.updateAdmin(this.adminId, payload).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Updated', 'Admin updated successfully', 'success')
            .then(() => this.router.navigate(['/admin/admin']));
        },
        error: err => {
          this.isLoading = false;
          Swal.fire('Error', err?.error?.message || 'Failed to update admin', 'error');
        }
      });
    } else {
      // CREATE
      if (!this.password) {
        Swal.fire('Validation', 'Password is required for new admin', 'warning');
        return;
      }
      const payload: any = {
        email: this.email,
        password: this.password,
        roleid: this.roleid,
        status: this.status
      };

      this.isLoading = true;
      this.adminService.createAdmin(payload).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Success', 'Admin created', 'success')
            .then(() => this.router.navigate(['/admin/admin']));
        },
        error: err => {
          this.isLoading = false;
          Swal.fire('Error', err?.error?.message || 'Failed to create admin', 'error');
        }
      });
    }
  }

  goBack() { this.router.navigate(['/admin/admin']); }
}
