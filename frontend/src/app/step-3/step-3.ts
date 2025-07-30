import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-step-3',
  standalone: false,
  templateUrl: './step-3.html',
  styleUrls: ['./step-3.css'],
})
export class Step3 implements OnInit, OnDestroy {
  isDark = true;
  nationalities: { value: string; label: string }[] = [];
  message = '';

  formData = {
    email: '',
    companyName: '',
    companyWebsite: '',
    nationality: '',
    countryOfIncorporation: '',
    natureOfBusiness: '',
    numberOfShareholders: 1,
    shareholders: [
      { fullName: '', nationality: '', dob: '', shareholding: 10 },
    ],
  };

  constructor(private svc: OnboardingService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    const cache =
      this.svc.getCachedData() ||
      JSON.parse(localStorage.getItem('onboarding-step3') || 'null');

    if (cache) {
      this.formData = {
        ...this.formData,
        ...cache,
        shareholders: cache.shareholders?.length
          ? cache.shareholders.map((s: any) => ({
              fullName: s.fullName || '',
              nationality: s.nationality || '',
              dob: s.dob ? s.dob.split('T')[0] : '', // ✅ 
              shareholding: s.shareholding ?? 10,
            }))
          : this.formData.shareholders,
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

  toggleDarkMode() {
    this.isDark = !this.isDark;
  }

  addShareholder() {
    this.formData.shareholders.push({
      fullName: '',
      nationality: '',
      dob: '',
      shareholding: 10,
    });
  }

  removeShareholder(index: number) {
    if (this.formData.shareholders.length > 1) {
      this.formData.shareholders.splice(index, 1);
    }
  }

  onShareholdersChange(event: Event) {
    const count = +(event.target as HTMLSelectElement).value;
    this.formData.numberOfShareholders = count;
    const currentLength = this.formData.shareholders.length;

    if (count > currentLength) {
      for (let i = currentLength; i < count; i++) {
        this.formData.shareholders.push({
          fullName: '',
          nationality: '',
          dob: '',
          shareholding: 10,
        });
      }
    } else if (count < currentLength) {
      this.formData.shareholders.splice(count);
    }
  }

  validateForm() {
    // Validate email, company name, etc.
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

    // Validate shareholders fields
    for (let i = 0; i < this.formData.shareholders.length; i++) {
      const shareholder = this.formData.shareholders[i];
      if (!shareholder.fullName) {
        this.toastr.error(`Shareholder ${i + 1} Full Name is required`);
        return false;
      }
      if (!shareholder.nationality) {
        this.toastr.error(`Shareholder ${i + 1} Nationality is required`);
        return false;
      }
      if (!shareholder.dob) {
        this.toastr.error(`Shareholder ${i + 1} Date of Birth is required`);
        return false;
      }
      if (shareholder.shareholding <= 0) {
        this.toastr.error(`Shareholder ${i + 1} Shareholding should be greater than 0`);
        return false;
      }
    }

    return true; // Form is valid
  }

  getMaxDobDate(): string {
    const today = new Date();
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));  // Subtract 18 years
    return minAgeDate.toISOString().split('T')[0];  // Format as YYYY-MM-DD
  }

  submitForm() {
    if (!this.validateForm()) {
      return;
    }

    const cached = this.svc.getCachedData() || {};
    const payload = {
      ...cached,
      ...this.formData,
      email: cached.email || this.formData.email,
      shareholders: [...this.formData.shareholders],
    };

    this.svc.saveOrUpdateOnboarding(payload).subscribe({
      next: (res) => {
        this.svc.setCachedData(res.data);
        localStorage.setItem('onboarding-step3', JSON.stringify(res.data));
        this.router.navigate(['/step-4']);
      },
      error: (err) => {
        console.error('Error saving step 3:', err);
        this.toastr.error('An error occurred while saving the data');
      },
    });
  }

  openDatePicker(index: number) {
    const input = document.getElementById(`dob-${index}`) as HTMLInputElement;
    input?.showPicker?.();
  }

  ngOnDestroy() {
    // Cache current state for back/next navigation
    this.svc.setCachedData(this.formData);
    localStorage.setItem('onboarding-step3', JSON.stringify(this.formData));
  }
}
