import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-step-1',
  standalone: false,
  templateUrl: './step-1.html',
  styleUrl: './step-1.css',
})
export class Step1 implements OnInit {
  isDark = true;
  SearchCountryField = SearchCountryField; // Assign to use in template
  CountryISO = CountryISO;

  formData = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    nationality: '',
    dob: '',
  };
  message = '';
  nationalities: { value: string; label: string }[] = [];

  constructor(
    private svc: OnboardingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {

    const saved = this.svc.getCachedData();
    if (saved) {
      this.formData = {
        firstName: saved.firstName || '',
        lastName: saved.lastName || '',
        mobileNumber: saved.mobileNumber || '',
        email: saved.email || '',
        nationality: saved.nationality || '',
        dob: saved.dob ? this.formatDate(saved.dob) : this.getCurrentDate(),
      };
    }

    this.svc.getNationalities().subscribe({
      next: (data: any) => {
        this.nationalities = data.map((item: any) => ({
          value: item.country,
          label: item.country,
        }));
      },
      error: () => (this.message = 'Failed to load nationalities'),
    });
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  openDatePicker() {
    const input = document.getElementById('dob') as HTMLInputElement;
    input?.showPicker?.();
  }

submitForm() {
   if (!this.formData.firstName) {
    this.toastr.error('First Name is required');
    return;
  }
  if (!this.formData.lastName) {
    this.toastr.error('Last Name is required');
    return;
  }
  if (!this.formData.mobileNumber) {
    this.toastr.error('Mobile Number is required');
    return;
  }
  if (!this.formData.email) {
    this.toastr.error('Email Address is required');
    return;
  }
  if (!this.formData.nationality) {
    this.toastr.error('Nationality is required');
    return;
  }
  if (!this.formData.dob) {
    this.toastr.error('Date of Birth is required');
    return;
  }
  const cached = this.svc.getCachedData() || {};

  const payload = {
    ...cached,
    ...this.formData,
    dob: this.formatDate(this.formData.dob),
  };

  this.svc.saveOrUpdateOnboarding(payload).subscribe({
    next: (res) => {
      this.svc.setCachedData(res.data);
      this.router.navigate(['/step-2']);
    },
    error: (err) => {
      console.error('Error saving step 1:', err);

      // Extract error message from backend response or default to a generic message
      const errorMessage = err?.error?.error || err?.message || 'Error saving your details';

      // Show the error message with Toastr
      this.toastr.error(errorMessage);  // Toastr will display the error message
    },
  });
}

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
  // Validate Date of Birth
  validateDob() {
    const today = new Date();
    const dob = new Date(this.formData.dob);
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    // Check if the user is under 18 or the DOB is in the future
    if (dob > today || age < 18 || (age === 18 && m < 0)) {
      return true; // Invalid DOB
    }
    return false; // Valid DOB
  }
  getMaxDobDate(): string {
    const today = new Date();
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return minAgeDate.toISOString().split('T')[0];
  }
}
