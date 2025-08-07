import { Component, OnInit } from '@angular/core';
import { Admin } from '../services/admin';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { Auth } from '../services/auth';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
 
@Component({
  selector: 'app-userrole',
  standalone: false,
  templateUrl: './userrole.html',
  styleUrl: './userrole.css'
})
export class Userrole implements OnInit {
  isLoading: boolean = false;
 
  // selectedRange: string = '';
  email: string = '';
  password: string = '';
  selectedPanterCode: string = '';
  roleid: string = '';
  status: string = '';
  firstName: string = '';
  lastName: string = '';
  mobileCountryCode: string = '';
  mobile: string = '';
  preferredName: string = '';
  vr_card_fee: string = '';
  load_balance_fee: string = '';
  master_load_balance: string = '';
  kyc_fee: string = '';
  isActive_fee: string = '';
  inActive_fee: string = '';
  transaction_fee: string = '';
  transfer_fee: string = '';
  py_card_fee: string = '';
  nationality: string = '';
  roles: any[] = [];
  panterCodes: any[] = [];
            // Mobile number entered by user (without country code)
 selectedRange: string = '';
  feeInput!: number;        // <-- holds whatever you type
  purchaseFeeRanges = [];
  preferredCountries: CountryISO[] = [];
 
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  separateDialCode = true; // Adjust if needed
 
  nationalities: { code: string }[] = [];

  constructor(
    private adminService: Admin,
    private router: Router,
    private toastr: ToastrService ,
    private authService: Auth,// Inject ToastrService
  ) {}
 
  ngOnInit() {
    // this.fetchRoles();
    // this.fetchPanterCodes();
    // // this.fetchMobileCountryCodes();
    // this. getAllowedgetAllowedNationalities();
 
   
  }
 
  goBack() {
    this.router.navigate(['/user']);
  }
 
  fetchRoles() {
    this.adminService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
      },
      error: (err) => console.error('Failed to fetch roles:', err)
    });
  }
 
  fetchPanterCodes() {
    this.adminService.getPanterCode().subscribe({
      next: (data) => {
        this.panterCodes = data;
      },
      error: (err) => console.error('Failed to fetch panter codes:', err)
    });
  }
 
parseRange(range: string): [number, number|null] {
  // if it ends with “+”, treat it as min and no max
  if (range.endsWith('+')) {
    const min = parseInt(range.replace('+',''), 10);
    return [min, null];
  }
  // otherwise split on “-” and parse both sides
  const parts = range.split('-');
  const min = parseInt(parts[0], 10);
  const max = parseInt(parts[1], 10);
  return [min, max];
}
 
 
  getAllowedgetAllowedNationalities(){
    this.authService.getAllowedNationalities().subscribe(
      (data) => {
        this.nationalities = data.nationalities; // Assuming the API returns an object with a `titles` array
      },
      (error) => {
        console.error('Error fetching countries:', error);
        this.toastr.error('An error occurred while fetching countries.');
      }
    );
  }
  // fetchMobileCountryCodes() {
 
  // }
  onMobileChange(event: any) {
    // The event contains the dial code (country code) and the phone number
    this.mobileCountryCode = event.dialCode; // Country code, e.g., +91
    this.mobile = event.number;               // The phone number entered by the user
    console.log('Country Code:', this.mobileCountryCode, 'Mobile Number:', this.mobile);
  }
 
  onSubmit() {
    const createdBy = localStorage.getItem('AdminID');
 
    // Validate numerical fields
    const numberPattern = /^[0-9]*$/;
    if (
      !numberPattern.test(this.vr_card_fee) ||
      !numberPattern.test(this.py_card_fee) ||
      !numberPattern.test(this.load_balance_fee) ||
      !numberPattern.test(this.kyc_fee) ||
 
      !numberPattern.test(this.transaction_fee) ||
      !numberPattern.test(this.transfer_fee)
    ) {
      this.toastr.error('Only numbers are allowed in fee fields.');
      return;
    }
    const [min, max] = this.parseRange(this.selectedRange);
 
    const adminData = {
      email: this.email.toLowerCase(), // Convert email to lowercase
      password: this.password,
      roleId: this.roleid,
      partnerCode: this.selectedPanterCode,
      createdBy: createdBy,
      first_name: this.firstName,
      last_name: this.lastName,
      master_load_balance:this.master_load_balance,
      mobile: this.mobile,
      status: this.status,
      preferred_name: this.preferredName,
      CategoryName: this.preferredName,
      nationality: this.nationality,
      py_card_fee: this.py_card_fee,
      vr_card_fee: this.vr_card_fee,
      load_balance_fee: this.load_balance_fee,
      transfer_fee: this.transfer_fee,
      kyc_fee: this.kyc_fee,
      transaction_fee: this.transaction_fee,
      isActive_fee: this.isActive_fee,
      inActive_fee: this.inActive_fee,
       purchaseFeeRanges: [
      {
        minAmount: min,
        maxAmount: max,
        feeAmount: this.feeInput
      }
    ]
 
    };
    this.isLoading = true; // Start loader
 
    // this.adminService.registerAdmin(adminData).subscribe({
    //   next: (response) => {
    //     this.toastr.success(response.message);
    //     this.isLoading = false; // Stop loader
 
    //     this.router.navigate(['/user']);
    //   },
    //   error: (err) => {
    //     console.error('Failed to register admin:', err);
    //     const errorMsg = err.error?.message || 'An unknown error occurred';
    //     this.toastr.error(errorMsg);
    //     this.isLoading = false; // Stop loader
 
    //   }
    // });
  }
  // parseRange(selectedRange: string): [any, any] {
  //   throw new Error('Method not implemented.');
  // }
 
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.description.toLowerCase().indexOf(term) > -1
        || item.code.toLowerCase().indexOf(term) > -1;
  }
 
}
 
 
 
 
 
 
 
 
 
 