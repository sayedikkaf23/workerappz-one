// step-2.component.ts
import { Component, OnInit } from '@angular/core';
import { Router }               from '@angular/router';
import { OnboardingService }    from '../services/onboarding.service';
@Component({
  selector: 'app-step-2',
  standalone: false,
  templateUrl: './step-2.html',
  styleUrl: './step-2.css'
})
export class Step2 implements OnInit {
  selectedRequirement: 'personal'|'business'|'prepaid'|'transfer' = 'personal';
  cache: any;

  constructor(
    private svc: OnboardingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cache = this.svc.getCachedData() || {};
    if (this.cache.requirements) {
      this.selectedRequirement = this.cache.requirements;
    }
  }

  submit() {
    // merge in our choice
    this.cache.requirements = this.selectedRequirement;
    this.svc.setCachedData(this.cache);

    // call the separate requirements API
    this.svc.saveRequirements({
      _id:          this.cache._id,
      email:        this.cache.email,
      requirements: this.selectedRequirement
    }).subscribe({
      next: () => this.router.navigate(['/step-3']),
      error: err => console.error('Step2 save failed', err)
    });
  }
}