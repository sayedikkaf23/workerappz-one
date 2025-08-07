// step-2.component.ts
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-step-2',
  standalone: false,
  templateUrl: './step-2.html',
  styleUrl: './step-2.css',
})
export class Step2 implements OnInit {
  // undefined = no default selection
  selectedRequirement?: 'personal' | 'business' | 'prepaid' | 'transfer';
  cache: any;
  loading = false;
  isDark = true;
  userId='';

  constructor(
    private svc: OnboardingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
         const email = sessionStorage.getItem('email');

    // pull from cache if it exists
    this.cache = this.svc.getCachedData() || {};
    if (email) {
      this.svc.getOnboardingDetailsByEmail(email).subscribe(
        (response) => {
          if (response.success) {
            const data = response.data;
            this.userId = data._id || '';
            // Restore the selectedRequirement from the cache
            this.selectedRequirement =
              data.requirements || this.cache.requirements;
          }
        },
        (error) => {
          console.error('Error fetching onboarding details:', error);
          this.toastr.error(
            error.message || 'Failed to fetch onboarding details'
          );
        }
      );
    }
  }

  onRequirementChange(req: 'personal' | 'business' | 'prepaid' | 'transfer') {
    this.selectedRequirement = req;

    // save to cache
    this.cache.requirements = req;
    this.svc.setCachedData(this.cache);
   const email = sessionStorage.getItem('email');


  const payload = {
    _id: this.userId, // Use the userId from the cache or formData
    email:email, // Use email from cache or formData
    selectedService: this.selectedRequirement // Add the selectedRequirement to payload
  };

  this.loading = true; // Set loading state to true
    let route = '';

  // Call the saveOrUpdateOnboarding API
  this.svc.saveOrUpdateOnboarding(payload).subscribe({
    next: () => {
      switch (req) {
      case 'personal':
        route = '/customer/personal-bank';
        break;

      case 'business':
        // ← here’s the correct business-bank path
        route = '/customer/business-bank';
        break;

      case 'prepaid':
        route = '/customer/prepaid-card';
        break;

      case 'transfer':
        route = '/customer/transfer';
        break;
    }

    // navigate
    this.router.navigate([route]);
      this.loading = false; 

       },
    error: (err) => {
      console.error('Step2 save failed', err);
      this.loading = false; // Set loading state to false on error
      this.toastr.error(err.message || 'Failed to save or update onboarding');
    },
  });
    // decide route
    
  }

 submit() {
  if (!this.selectedRequirement) {
    console.warn('Please select one before continuing.');
    return;
  }

     const email = sessionStorage.getItem('email');


  const payload = {
    email:email, // Use email from cache or formData
    selectedService: this.selectedRequirement // Add the selectedRequirement to payload
  };

  this.loading = true; // Set loading state to true

  // Call the saveOrUpdateOnboarding API
  this.svc.saveOrUpdateOnboarding(payload).subscribe({
    next: () => {
      this.loading = false; // Set loading state to false after successful request

      // Navigate based on the selected requirement
      let nextRoute = '';
      switch (this.selectedRequirement) {
        case 'personal':
          nextRoute = '/customer/personal-bank';
          break;
        case 'business':
          nextRoute = '/customer/business-bank';
          break;
        case 'prepaid':
          nextRoute = '/customer/prepaid-card';
          break;
        case 'transfer':
          nextRoute = '/customer/transfer';
          break;
      }
      this.router.navigate([nextRoute]); // Navigate to the next route
    },
    error: (err) => {
      console.error('Step2 save failed', err);
      this.loading = false; // Set loading state to false on error
      this.toastr.error(err.message || 'Failed to save or update onboarding');
    },
  });
}


  toggleDarkMode() {
    this.isDark = !this.isDark;
    document
      .querySelector('.theme-wrapper')
      ?.classList.toggle('dark-active', this.isDark);
  }
}
