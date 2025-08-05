import { Component, OnInit, OnDestroy } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-personal-bank',
  standalone: false,
  templateUrl: './personal-bank.html',
  styleUrls: ['./personal-bank.css']
})
export class PersonalBank implements OnInit, OnDestroy {
  isDark = true;
  nationalities: { value: string; label: string }[] = [];
  message = '';
  loading = false;
  formData: any = {
        _id: '',              //  👈  NEW

    resident: '',
    working: '',
    salary: '',
    companyname: '',
    Bank: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    nationality: '',
    countryOfIncorporation: '',
    natureOfBusiness: '',
    numberOfShareholders: 1,
    shareholders: [{ fullName: '', nationality: '', dob: '', shareholding: 10 }],
  };

  constructor(
    private svc: OnboardingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

 ngOnInit() {
  // Retrieve the email from sessionStorage
  const email = sessionStorage.getItem('email');  // Assuming 'userEmail' is stored in sessionStorage
  
  console.log('Email retrieved from session:', email);  // Log to check the value of the email
  
  if (email) {
    // Fetch the onboarding details using the email
    this.svc.getOnboardingDetailsByEmail(email).subscribe(
      (data) => {
                console.log('API Response:', data);  // Log the entire response

                this.formData._id     = data.data._id || '';
                console.log(data._id)

        // Populate formData with the API response data
        this.formData.email = email;  // Assign email from sessionStorage
        this.formData.resident = data.data.resident;
        console.log("sss",data.data.resident)
        this.formData.salary = data.data.salary || '';  // Handle null or empty salary
                this.formData.working = data.data.working || '';  // Handle null or empty salary

        this.formData.companyname = data.data.companyName || '';  // Handle null company name
        this.formData.Bank = data.data.Bank || '';  // Handle null bank name

        // Load saved form data from sessionStorage (if available)
       

        // Log the data for debugging
        console.log('Onboarding data fetched:', data);
        console.log('Form data after setting:', this.formData);  // Check if formData is populated
      },
      () => {
        this.message = 'Failed to load onboarding details';
      }
    );
  } else {
    this.message = 'No email found in session';
    console.error('No email found in session');
  }

  // Load nationality options
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

  submitForm() {
    this.loading = true;

    // Save form data to sessionStorage before navigation
    sessionStorage.setItem('onboarding-step3', JSON.stringify(this.formData));

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
