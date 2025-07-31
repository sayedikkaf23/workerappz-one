
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-1',
  standalone: false,
  templateUrl: './step-1.html',
  styleUrl: './step-1.css',
})

  
export class Step1 implements OnInit {
   isDark = true;
    SearchCountryField = SearchCountryField;  // Assign to use in template
  CountryISO = CountryISO;  

  formData = {
    firstName: '',
    lastName: '',
    mobileNumber: null,
    email: '',
    nationality: '',
    dob: this.getCurrentDate(), 
  };
  message = '';
  nationalities: { value: string; label: string }[] = [];

  constructor(private svc: OnboardingService, private router: Router) {}

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
      error: (err) => console.error('Error saving step 1:', err),
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
}
