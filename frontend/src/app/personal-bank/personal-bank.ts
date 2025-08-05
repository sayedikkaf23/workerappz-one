import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
@Component({
  selector: 'app-personal-bank',
  standalone: false,
  templateUrl: './personal-bank.html',
  styleUrl: './personal-bank.css'
})
export class PersonalBank {
   isDark = true;
  nationalities: { value: string; label: string }[] = [];
  message = '';
  loading = false;

  formData: {
    // Step 2 fields
    resident: string;
    working: string;
    salary: string;
    companyname: string;
    Bank: string;
    // Step 3 fields
    email: string;
    companyName: string;
    companyWebsite: string;
    nationality: string;
    countryOfIncorporation: string;
    natureOfBusiness: string;
    numberOfShareholders: number;
    shareholders: Array<{
      fullName: string;
      nationality: string;
      dob: string;
      shareholding: number;
    }>;
  } = {
    // Step 2 defaults
    resident: '',
    working: '',
    salary: '',
    companyname: '',
    Bank: '',
    // Step 3 defaults
    email: '',
    companyName: '',
    companyWebsite: '',
    nationality: '',
    countryOfIncorporation: '',
    natureOfBusiness: '',
    numberOfShareholders: 1,
    shareholders: [
      { fullName: '', nationality: '', dob: '', shareholding: 10 }
    ]
  };

  constructor(
    private svc: OnboardingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // load cached data
    const cache = this.svc.getCachedData() ||
                  JSON.parse(localStorage.getItem('onboarding-step3') || 'null');
    if (cache) {
      this.formData = {
        ...this.formData,
        ...cache,
        shareholders: cache.shareholders?.length
          ? cache.shareholders.map((s: any) => ({
              fullName: s.fullName || '',
              nationality: s.nationality || '',
              dob: s.dob ? s.dob.split('T')[0] : '',
              shareholding: s.shareholding ?? 10
            }))
          : this.formData.shareholders
      };
    }

    // load nationality options
    this.svc.getNationalities().subscribe({
      next: data => {
        this.nationalities = data.map((item: any) => ({
          value: item.country,
          label: item.country
        }));
      },
      error: () => (this.message = 'Failed to load nationalities')
    });
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
  }

  // only used if you re-enable shareholders UI
  onShareholdersChange(event: Event) {
    const count = +(event.target as HTMLSelectElement).value;
    this.formData.numberOfShareholders = count;
    const current = this.formData.shareholders.length;
    if (count > current) {
      for (let i = current; i < count; i++) {
        this.formData.shareholders.push({
          fullName: '', nationality: '', dob: '', shareholding: 10
        });
      }
    } else {
      this.formData.shareholders.splice(count);
    }
  }

  allowOnlyLetters(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode || e.which);
    if (!/[A-Za-z ]/.test(char)) e.preventDefault();
  }

  getMaxDobDate(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  }

  validateForm(): boolean {
    // Step 2 validations
    if (!this.formData.resident) {
      this.toastr.error('Resident status is required');
      return false;
    }
    if (!this.formData.working) {
      this.toastr.error('Working status is required');
      return false;
    }
    if (this.formData.working === 'Salaried' && !this.formData.salary) {
      this.toastr.error('Salary is required');
      return false;
    }
    if (this.formData.working === 'Self Employed' && !this.formData.companyname) {
      this.toastr.error('Company name is required');
      return false;
    }
    if (!this.formData.Bank) {
      this.toastr.error('Account type is required');
      return false;
    }

    // Step 3 validations
    if (!this.formData.email) {
      this.toastr.error('Email is required');
      return false;
    }
    if (!this.formData.companyName) {
      this.toastr.error('Company Name is required');
      return false;
    }
    if (!this.formData.companyWebsite) {
      this.toastr.error('Company Website is required');
      return false;
    }
    if (!this.formData.nationality) {
      this.toastr.error('Nationality is required');
      return false;
    }
    if (!this.formData.countryOfIncorporation) {
      this.toastr.error('Country of Incorporation is required');
      return false;
    }
    if (!this.formData.natureOfBusiness) {
      this.toastr.error('Nature of Business is required');
      return false;
    }

    return true;
  }

  submitForm() {
    if (!this.validateForm()) return;

    const cached = this.svc.getCachedData() || {};
    const payload = {
      ...cached,
      ...this.formData,
      email:   cached.email || this.formData.email,
      shareholders: [...this.formData.shareholders]
    };

    this.loading = true;
    this.svc.saveOrUpdateOnboarding(payload).subscribe({
      next: res => {
        this.svc.setCachedData(res.data);
        localStorage.setItem('onboarding-step3', JSON.stringify(res.data));
        this.loading = false;
        this.router.navigate(['/step-4']);
      },
      error: err => {
        console.error('Error saving:', err);
        this.loading = false;
        this.toastr.error('An error occurred while saving the data');
      }
    });
  }

  ngOnDestroy() {
    this.svc.setCachedData(this.formData);
    localStorage.setItem('onboarding-step3', JSON.stringify(this.formData));
  }
}