import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-step-3',
  standalone: false,
  templateUrl: './step-3.html',
  styleUrls: ['./step-3.css'],
})
export class Step3 implements OnInit, OnDestroy {
  isDark = true;
  nationalities: { value: string; label: string }[] = [];
  businessCategories: { value: string; label: string }[] = [];

  message = '';
  loading: boolean = false;

  formData = {
    _id: '',
    email: '',
    companylocation: '',
    numberOfShareholders: 0,
    Companylicensed: '',
    companyactivity: '',
    Turnover: '',
    Bank: '',
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
    const email = sessionStorage.getItem('email');

    if (email) {
      this.svc.getOnboardingDetailsByEmail(email).subscribe(
        (data) => {
          this.formData._id = data.data._id || '';
          this.formData.email = email;
          this.formData.companylocation = data.data.companylocation || '';
          this.formData.Companylicensed = data.data.Companylicensed || '';
          this.formData.companyactivity = data.data.companyactivity || '';
          this.formData.Turnover = data.data.Turnover || '';
          this.formData.Bank = data.data.Bank || '';

          if (data.data.shareholders && data.data.shareholders.length > 0) {
            this.formData.shareholders = data.data.shareholders;
            this.formData.numberOfShareholders = data.data.shareholders.length;
          }
        },
        () => (this.message = 'Failed to load onboarding details')
      );
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

    this.svc.getBusinessCategory().subscribe({
      next: (response: any) => {
        this.businessCategories = response.data.map((item: any) => ({
          value: item.name,
          label: item.name,
        }));
      },
      error: () => (this.message = 'Failed to load business categories'),
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
    this.formData.numberOfShareholders = this.formData.shareholders.length;
  }

 removeShareholder(index: number) {
  this.formData.shareholders.splice(index, 1);
  this.formData.numberOfShareholders = this.formData.shareholders.length;
}


  allowOnlyLetters(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode || e.which);
    if (!/[A-Za-z ]/.test(char)) {
      e.preventDefault();
    }
  }

  onShareholdersChange(event: Event) {
    const count = +(event.target as HTMLSelectElement).value;
    this.formData.numberOfShareholders = count;

    if (count > this.formData.shareholders.length) {
      for (let i = this.formData.shareholders.length; i < count; i++) {
        this.formData.shareholders.push({
          fullName: '',
          nationality: '',
          dob: '',
          shareholding: 10,
        });
      }
    } else {
      this.formData.shareholders = this.formData.shareholders.slice(0, count);
    }
  }

  validateForm() {
    const onlyLetters = /^[A-Za-z ]+$/;

    for (let i = 0; i < this.formData.shareholders.length; i++) {
      const shareholder = this.formData.shareholders[i];

      if (!shareholder.fullName?.trim()) {
        this.toastr.error(`Shareholder ${i + 1} Full Name is required`);
        return false;
      }

      if (!onlyLetters.test(shareholder.fullName)) {
        this.toastr.error(
          `Shareholder ${i + 1} Full Name can contain only letters`
        );
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
        this.toastr.error(
          `Shareholder ${i + 1} Shareholding should be greater than 0`
        );
        return false;
      }
    }
    return true;
  }

  getMaxDobDate(): string {
    const today = new Date();
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return minAgeDate.toISOString().split('T')[0];
  }

  submitForm() {
    if (!this.validateForm()) return;

    const cached = this.svc.getCachedData() || {};

    const formattedShareholders = this.formData.shareholders.map((sh) => ({
      ...sh,
      dob: new Date(sh.dob).toISOString().split('T')[0],
    }));

    const payload = {
      ...this.formData,
      email: cached.email || this.formData.email,
      shareholders: formattedShareholders,
    };

    this.loading = true;
    this.svc.saveOrUpdateOnboarding(payload).subscribe({
      next: (res) => {
        this.svc.setCachedData(res.data);
        this.loading = false;
        this.router.navigate(['/customer/step-4']);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('An error occurred while saving the data');
      },
    });
  }

  openDatePicker(index: number) {
    const input = document.getElementById(`dob-${index}`) as HTMLInputElement;
    input?.showPicker?.();
  }

  ngOnDestroy() {
    this.svc.setCachedData(this.formData);
  }
}
