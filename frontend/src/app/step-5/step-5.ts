import { Component } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';

@Component({
  selector: 'app-step-5',
  standalone: false,
  templateUrl: './step-5.html',
  styleUrl: './step-5.css'
})
export class Step5 {

  isDark = true;
  onboardingData: any;

  constructor(private onboardingService: OnboardingService) {}

  ngOnInit() {
    // 1️⃣ First, try to get email from cache or session storage
    let email = this.onboardingService.getCachedData()?.email || sessionStorage.getItem('email') || '';

    // 2️⃣ If email is available, save it in session storage
    if (email) {
      sessionStorage.setItem('email', email);
    }

    // 3️⃣ Call API only if email is present
    if (email) {
      this.onboardingService.getOnboardingDetailsByEmail(email).subscribe(
        (response) => {
          if (response.success) {
            this.onboardingData = response.data;
            console.log('Fetched onboarding data:', this.onboardingData);
          }
        },
        (error) => {
          console.error('Error fetching onboarding data:', error);
        }
      );
    } else {
      console.warn('Email not found in cache or session storage.');
    }
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
