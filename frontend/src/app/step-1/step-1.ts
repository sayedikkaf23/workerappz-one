import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-1',
  standalone: false,
  templateUrl: './step-1.html',
  styleUrl: './step-1.css'
})
export class Step1 implements OnInit {
  formData = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    nationality: '',
    dob: '1990-01-01'
  };
  message = '';

  constructor(
    private svc: OnboardingService,
    private router: Router
  ) {}

  ngOnInit() {
    const saved = this.svc.getCachedData();
    if (saved) {
      this.formData = {
        firstName: saved.firstName || '',
        lastName: saved.lastName || '',
        mobileNumber: saved.mobileNumber || '',
        email: saved.email || '',
        nationality: saved.nationality || '',
        dob: saved.dob ? new Date(saved.dob).toISOString().substr(0,10) : '1990-01-01'
      };
    }
  }

  openDatePicker() {
    const input = document.getElementById('dob') as HTMLInputElement;
    input?.showPicker?.();
  }

  submitForm() {
    this.svc.saveOrUpdateOnboarding(this.formData)
      .subscribe({
        next: res => {
          // cache the full user (with _id, email, etc)
          this.svc.setCachedData(res.data);
          this.router.navigate(['/step-2']);
        },
        error: err => {
          console.error(err);
          this.message = 'Error submitting form';
        }
      });
  }
}