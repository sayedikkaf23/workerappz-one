import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-personal-bank',
  standalone: false,
  templateUrl: './personal-bank.html',
  styleUrls: ['./personal-bank.css'],
})
export class PersonalBank implements OnInit, OnDestroy {
  isDark = true;
  nationalities: { value: string; label: string }[] = [];
  message = '';
  loading = false;
  formData: any = {
    selectedService: 'personal',

    _id: '',
    resident: '',
    working: '',
    salary: '',
    companyname: '',
    personalBank: '',
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

          // Populate personal form fields
          this.formData.resident = data.data.resident || '';
          this.formData.working = data.data.working || '';
          this.formData.salary = data.data.salary || '';
          this.formData.companyname = data.data.companyName || '';
          this.formData.personalBank = data.data.personalBank || '';

          // ✅ Handle shareholders
          this.formData.numberOfShareholders =
            data.data.numberOfShareholders || 1;

          if (data.data.shareholders && data.data.shareholders.length > 0) {
            this.formData.shareholders = data.data.shareholders.map(
              (sh: any) => ({
                fullName: sh.fullName || '',
                nationality: sh.nationality || '',
                dob: sh.dob ? new Date(sh.dob).toISOString().split('T')[0] : '',
                shareholding: sh.shareholding || 10,
              })
            );
          } else {
            this.formData.shareholders = [
              { fullName: '', nationality: '', dob: '', shareholding: 10 },
            ];
          }

          // Ensure shareholders array length matches dropdown
          if (
            this.formData.shareholders.length <
            this.formData.numberOfShareholders
          ) {
            for (
              let i = this.formData.shareholders.length;
              i < this.formData.numberOfShareholders;
              i++
            ) {
              this.formData.shareholders.push({
                fullName: '',
                nationality: '',
                dob: '',
                shareholding: 10,
              });
            }
          } else if (
            this.formData.shareholders.length >
            this.formData.numberOfShareholders
          ) {
            this.formData.shareholders = this.formData.shareholders.slice(
              0,
              this.formData.numberOfShareholders
            );
          }
        },
        () => {
          this.message = 'Failed to load onboarding details';
        }
      );
    }

    this.svc.getNationalities().subscribe(
      (data) => {
        this.nationalities = data.map((item: any) => ({
          value: item.country,
          label: item.country,
        }));
      },
      () => {
        this.message = 'Failed to load nationalities';
      }
    );
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
    if (this.formData.shareholders.length > 1) {
      this.formData.shareholders.splice(index, 1);
      this.formData.numberOfShareholders = this.formData.shareholders.length;
    }
  }

  //   ngOnInit() {
  //     // Retrieve the email from sessionStorage
  //     const email = sessionStorage.getItem('email');

  //     console.log('Email retrieved from session:', email);

  //     if (email) {
  //       // Fetch the onboarding details using the email
  //       this.svc.getOnboardingDetailsByEmail(email).subscribe(
  //         (data) => {
  //           console.log('API Response:', data); // Log the entire response

  //           this.formData._id = data.data._id || '';
  //           console.log(data._id);

  //           // Populate formData with the API response data
  //           this.formData.email = email; // Assign email from sessionStorage
  //          this.formData.resident = data.data.resident || '';
  // this.formData.working = data.data.working || '';
  // this.formData.salary = data.data.salary || '';
  // this.formData.companyname = data.data.companyName || '';
  // this.formData.personalBank = data.data.personalBank || ''; // ✅ Correct binding

  //           // Load saved form data from sessionStorage (if available)

  //           // Log the data for debugging
  //           console.log('Onboarding data fetched:', data);
  //           console.log('Form data after setting:', this.formData); // Check if formData is populated
  //         },
  //         () => {
  //           this.message = 'Failed to load onboarding details';
  //         }
  //       );
  //     } else {
  //       this.message = 'No email found in session';
  //       console.error('No email found in session');
  //     }

  //     // Load nationality options
  //     this.svc.getNationalities().subscribe(
  //       (data) => {
  //         this.nationalities = data.map((item: any) => ({
  //           value: item.country,
  //           label: item.country,
  //         }));
  //       },
  //       () => {
  //         this.message = 'Failed to load nationalities';
  //       }
  //     );
  //   }

  toggleDarkMode() {
    this.isDark = !this.isDark;
  }

  onShareholdersChange(event: Event) {
    const count = +(event.target as HTMLSelectElement).value;
    this.formData.numberOfShareholders = count;
    const current = this.formData.shareholders.length;
    if (count > current) {
      for (let i = current; i < count; i++) {
        this.formData.shareholders.push({
          fullName: '',
          nationality: '',
          dob: '',
          shareholding: 10,
        });
      }
    } else {
      this.formData.shareholders.splice(count);
    }
  }
  validateForm() {
    if (!this.formData.resident) {
      this.toastr.error('Resident status is required');
      return false;
    }

    if (!this.formData.working) {
      this.toastr.error('Employment status is required');
      return false;
    }

    if (this.formData.working === 'Salaried' && !this.formData.salary) {
      this.toastr.error('Salary range is required for salaried individuals');
      return false;
    }

    if (
      this.formData.working === 'Self Employed' &&
      !this.formData.companyname
    ) {
      this.toastr.error(
        'Company name is required for self-employed individuals'
      );
      return false;
    }

    if (!this.formData.personalBank) {
      this.toastr.error('Bank account option is required');
      return false;
    }

    return true;
  }

  submitForm() {
    if (!this.validateForm()) {
      return;
    }
    const payload = {
      ...this.formData,
      requirements: 'personal', // enforce correct type
      personalBank: this.formData.personalBank,
    };

    this.loading = true;

    // Save form data to sessionStorage before navigation
    sessionStorage.setItem('onboarding-step3', JSON.stringify(payload));

    this.svc.saveOrUpdateOnboarding(this.formData).subscribe(
      (res) => {
        // Save the response data to sessionStorage after submitting
        sessionStorage.setItem('onboarding-step3', JSON.stringify(res.data));
        this.svc.setCachedData(res.data);
        this.loading = false;
        this.router.navigate(['/customer/personal-review']);
      },
      (err) => {
        console.error('Error saving:', err);
        this.loading = false;
        this.toastr.error('An error occurred while saving the data');
      }
    );
  }

  ngOnDestroy() {
    // Save form data to sessionStorage before leaving the component
    sessionStorage.setItem('onboarding-step3', JSON.stringify(this.formData));
  }
}
