import { Component } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
@Component({
  selector: 'app-personal-review-order',
  standalone: false,
  templateUrl: './personal-review-order.html',
  styleUrl: './personal-review-order.css'
})
export class PersonalReviewOrder {
  isDark = true;
  onboardingData: any;
  loading: boolean = false;


  constructor(private onboardingService: OnboardingService) {}

  ngOnInit() {
    // Get email from cache or session storage
    let email: string | null =
      this.onboardingService.getCachedData()?.email ||
      sessionStorage.getItem('email');

    if (!email) {
      console.warn('Email not found in cache or session storage.');
      this.loading = false;
      return; // exit if email is not found
    }

    sessionStorage.setItem('email', email);  // Store the email in sessionStorage if found
    this.loading = true; // Start loading

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
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    const wrapper = document.querySelector('.theme-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('dark-active', this.isDark);
    }
  }


}
