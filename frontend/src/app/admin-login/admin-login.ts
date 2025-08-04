import { Component } from '@angular/core';
import { AdminService } from '../services/admin.service'; // Import AdminService
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
})
export class AdminLogin {
  isDark = true;
  email: string = '';
  password: string = '';
  token: string = '';
  mfaRequired: boolean = false;
  loading: boolean = false; // Loading state for the login button

  constructor(private adminService: AdminService, private router: Router) {}

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
    const loginData = { email: this.email, password: this.password };

    if (!this.mfaRequired) {
      this.adminService.login(loginData).subscribe(
        (response) => {
          this.loading = false;
          if (response.mfaRequired) {
            this.mfaRequired = true;
          } else {
            console.log('Login successful:', response);
          }
        },
        (error) => {
          this.loading = false;
          console.error('Login failed:', error);
        }
      );
    } else {
      this.verifyMFA();
    }
  }

  verifyMFA() {
    this.loading = true;
    this.adminService.verifyMFA(this.token, this.email).subscribe(
      (response) => {
        this.loading = false;
        console.log('MFA verified:', response);
        this.router.navigate(['/adminhome']); // This will navigate to /admindashboard route
      },
      (error) => {
        this.loading = false;
        console.error('MFA verification failed:', error);
      }
    );
  }
}
