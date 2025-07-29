import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';

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

  constructor(private svc: OnboardingService, private router: Router) {}

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

  submitForm() {
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
      error: (err) => console.error('Error saving step 3:', err),
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
