import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

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
  loading: boolean = false;
  formData = {
    _id:'',
    email: '',
    companylocation:'',
    numberOfShareholders: 1,
    Companylicensed:'',
    companyactivity:'',
    Turnover:'',
    Bank:'',
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
      const email = sessionStorage.getItem('email');  // Assuming 'userEmail' is stored in sessionStorage

   

     if (email) {
    // Fetch the onboarding details using the email
    this.svc.getOnboardingDetailsByEmail(email).subscribe(
      (data) => {
                console.log('API Response:', data);  // Log the entire response

                this.formData._id     = data.data._id || '';
                console.log(data._id)

        // // Populate formData with the API response data
        this.formData.email = email;  // Assign email from sessionStorage
        this.formData.companylocation = data.data.companylocation;
                this.formData.Companylicensed = data.data.Companylicensed;
        this.formData.companyactivity = data.data.companyactivity;
        this.formData.Turnover = data.data.Turnover;
        this.formData.Bank = data.data.Bank;
         this.formData.shareholders = data.data.shareholders || [
            { fullName: '', nationality: '', dob: '', shareholding: 10 },
          ];

      

        // Log the data for debugging
        console.log('Onboarding data fetched:', data);
        console.log('Form data after setting:', this.formData);  // Check if formData is populated
      },
      () => {
        this.message = 'Failed to load onboarding details';
      }
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
  allowOnlyLetters(e: KeyboardEvent) {
    const char = String.fromCharCode(e.keyCode || e.which);
    if (!/[A-Za-z ]/.test(char)) {
      e.preventDefault();
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

  validateForm() {
    // Validate email, company name, etc.
   
   

    // Validate shareholders fields
    for (let i = 0; i < this.formData.shareholders.length; i++) {
      const onlyLetters = /^[A-Za-z ]+$/; // place near top of method

      const shareholder = this.formData.shareholders[i];
      // if (!shareholder.fullName) {
      //   this.toastr.error(`Shareholder ${i + 1} Full Name is required`);
      //   return false;
      // }
      if (!shareholder.fullName?.trim()) {
        this.toastr.error(`Shareholder ${i + 1} Full Name is required`);
        return false;
      }

      /* 2️⃣ contains digits/symbols? */
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

    return true; // Form is valid
  }

  getMaxDobDate(): string {
    const today = new Date();
    const minAgeDate = new Date(today.setFullYear(today.getFullYear() - 18)); // Subtract 18 years
    return minAgeDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  submitForm() {
    if (!this.validateForm()) {
      return;
    }

    const cached = this.svc.getCachedData() || {};

     const formattedShareholders = this.formData.shareholders.map(shareholder => {
    const formattedDob = new Date(shareholder.dob).toISOString().split('T')[0]; // Format the date
    return {
      ...shareholder,
      dob: formattedDob,  // Use the formatted date
    };
  });
    const payload = {
      // ...cached,
      ...this.formData,
      email: cached.email || this.formData.email,
      shareholders:formattedShareholders,
    };

    this.loading = true;

    this.svc.saveOrUpdateOnboarding(payload).subscribe({
      next: (res) => {
        this.svc.setCachedData(res.data);
        this.loading = false;
        this.router.navigate(['/customer/step-4']);
      },
      error: (err) => {
        console.error('Error saving step 3:', err);
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
    // Cache current state for back/next navigation
    this.svc.setCachedData(this.formData);
  }
}
