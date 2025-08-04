import { Component } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';

@Component({
  selector: 'app-step-5',
  standalone: false,
  templateUrl: './step-5.html',
  styleUrls: ['./step-5.css']
})
export class Step5 {
  isDark = true;
  onboardingData: any;
  loading: boolean = false;
  constructor(private onboardingService: OnboardingService) {}

  ngOnInit() {
    // Get email from cache or session storage
    let email =
      this.onboardingService.getCachedData()?.email ||
      sessionStorage.getItem('email') ||
      '';

    if (email) {
      sessionStorage.setItem('email', email);
      this.loading =true;
      this.onboardingService.getOnboardingDetailsByEmail(email).subscribe(
        (response) => {
          if (response.success) {
            this.onboardingData = response.data;
            console.log('Fetched onboarding data:', this.onboardingData);
            this.loading = false;
          }
        },
        (error) => {
          console.error('Error fetching onboarding data:', error);
          this.loading = false;
        }
      );
    } else {
      console.warn('Email not found in cache or session storage.');
      this.loading = false;
    }
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    const wrapper = document.querySelector('.theme-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('dark-active', this.isDark);
    }
  }

 getFileType(fileName: string): 'pdf' | 'excel' | 'image' | 'unknown' {
  if (!fileName) return 'unknown';
  const ext = fileName.split('.').pop()!.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
  return 'unknown';
}

  openFile(url: string): void {
    window.open(url, '_blank');
  }
}
