import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service'; // Import AdminService
import { Router } from '@angular/router'; // Import Router
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
})
export class AdminLogin {
  isDark = true;
  loading = false;  // for initial GET

  email: string = '';
  auth_Code: string = '';
  password: string = '';
  token: string = '';
  mfaRequired: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  // Toggle Dark Mode
  toggleDarkMode() {
    this.isDark = !this.isDark;
    const wrapper = document.querySelector('.theme-wrapper');
    if (wrapper) {
      if (this.isDark) {
        wrapper.classList.add('dark-active');
      } else {
        wrapper.classList.remove('dark-active');
      }
    }
  }

  onLoginSubmit() {
    this.loading = true;
    const loginData = {
      email: this.email,
      password: this.password,
      auth_Code: this.auth_Code,
    };

    if (loginData) {
      this.adminService.login(loginData).subscribe(
        (response) => {
          this.loading = false;
          const token = response?.data?.resData?.token;

          if (token) {
            sessionStorage.setItem('token', token);
          }
          this.router.navigate(['/admin/home']); // This will navigate to /admindashboard route
        },
        (error) => {
          this.loading = false;
         const serverMessage =
    // your sample: { message, error: { resData } }
    error?.error?.error?.resData ||
    // sometimes backend may send { resData } directly
    error?.error?.resData ||
    // or { message: '...' }
    error?.error?.message ||
    // final fallbacks
    error?.statusText ||
    'Login failed. Please try again.';
          this.toastr.error(serverMessage);
          console.error('Login failed:', error);
        }
      );
    }
  }

  // verifyMFA() {
  //   this.loading = true;
  //   this.adminService.verifyMFA(this.token, this.email).subscribe(
  //     (response) => {
  //       this.loading = false;
  //       console.log('MFA verified:', response);
  //       this.router.navigate(['/admin/home']); // This will navigate to /admindashboard route
  //     },
  //      (error) => {
  //       this.loading = false;
  //       const errorMessage =
  //         error?.error?.message || error?.message || 'MFA verification failed.';
  //       this.toastr.error(errorMessage);
  //       console.error('MFA verification failed:', error);
  //     }
  //   );
  // }
}
