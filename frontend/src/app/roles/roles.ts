import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../services/admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles {
  
  roleName: string = '';
  isLoading: boolean = false;
  status: boolean = false;
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
  selectedPermissions: string[] = [];

  constructor(
    private adminService: Admin,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onPermissionChange(event: any) {
    const permission = event.target.value;
    if (event.target.checked) {
      this.selectedPermissions.push(permission);
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(
        (p) => p !== permission
      );
    }
  }

  goBack() {
    this.router.navigate(['/usersrole']); // Change to the correct route
  }

  onSubmit() {
    const payload = {
      role_name: this.roleName?.toLowerCase(),
      permissions: this.selectedPermissions,
      status: this.status,
    };

    // Start loader
    this.isLoading = true;

    this.adminService.createRole(payload).subscribe(
      (response) => {
        const successMessage = `Role "${response.role_name}" created successfully!`;
        this.toastr.success(response.message, 'Success');
        this.roleName = '';
        this.selectedPermissions = [];
        this.status = false;
        // Stop loader
        this.isLoading = false;
        this.router.navigate(['/usersrole']);
      },
      (error) => {
        const errorMessage =
          error?.error?.message ||
          'An unexpected error occurred. Please try again.';
        this.toastr.error(errorMessage, 'Error');
        console.error('Error creating role:', error);
        // Stop loader
        this.isLoading = false;
      }
    );
  }

}
