// step-2.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';

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

  constructor(private svc: OnboardingService, private router: Router) {}

  ngOnInit() {
    // pull from cache if it exists
    this.cache = this.svc.getCachedData() || {};
    if (this.cache.requirements) {
      this.selectedRequirement = this.cache.requirements;
    }
  }

  onRequirementChange(req: 'personal' | 'business' | 'prepaid' | 'transfer') {
    this.selectedRequirement = req;

    // save to cache
    this.cache.requirements = req;
    this.svc.setCachedData(this.cache);

    // decide route
    let route = '';
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
  }

  submit() {
    if (!this.selectedRequirement) {
      console.warn('Please select one before continuing.');
      return;
    }
    this.loading = true;
    this.svc
      .saveRequirements({
        _id: this.cache._id,
        email: this.cache.email,
        requirements: this.selectedRequirement,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          // route according to what was just saved
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
          this.router.navigate([nextRoute]);
        },
        error: (err) => {
          console.error('Step2 save failed', err);
          this.loading = false;
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
