import { Component, OnInit } from '@angular/core';
import { Admin } from '../services/admin';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { Auth } from '../services/auth';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.html',
  styleUrl: './user-edit.css'
})
export class UserEdit {
  preferredCountries: CountryISO[] = [];

  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  SearchCountryField = SearchCountryField;
  separateDialCode = true; // Adjust if needed
   email: string = '';
    password: string = '';
    selectedPanterCode: string = '';
    roleid: string = '';
    status: boolean = false ;
    firstName: string = '';
    lastName: string = '';
    mobileCountryCode: string = '';
    mobile: string = '';
    preferredName: string = '';
    selectedRange: string = '';
    vr_card_fee: number = 0;
    load_balance_fee: number = 0;
    master_load_balance: number = 0;
    tranfer_fee:number=0;
    kyc_fee:number=0;
    isActive_fee:number=0;
    inActive_fee:number=0;
    transaction_fee:number=0;
  py_card_fee: number = 0;
    nationality: string = '';
    roles: any[] = [];
    panterCodes: any[] = [];
    mobileCountryCodes: { code: string; description: string }[] = []; 
     nationalities: { code: string }[] = [];
    user: any = null;
  selectedCountry: { code: string; description: string; } = { code: '', description: '' }; 
  originalUserData: {
    _id: string;
    email: string; password: string; // if password is loaded or left blank if not edited
    firstName: string; 
    lastName: string;
     mobileCountryCode: string;
      mobile: string;
       preferredName: string; nationality: string; 
       selectedPanterCode: string; 
       roleid: string;
        status: boolean;
        py_card_fee:number;
        vr_card_fee:number;
        load_balance_fee:number;
        master_load_balance:number;
        tranfer_fee:number;
        kyc_fee:number;
        transaction_fee:number;
         isActive_fee:number;
    inActive_fee:number;
  }  = {
    _id: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    mobileCountryCode: '',
    mobile: '',
    preferredName: '',
    nationality: '',
    selectedPanterCode: '',
    roleid: '',
    status: false,
    py_card_fee: 0,
    vr_card_fee: 0,
    load_balance_fee: 0,
    master_load_balance: 0,
    tranfer_fee: 0,
    kyc_fee: 0,
    transaction_fee: 0,
    isActive_fee: 0,
    inActive_fee: 0,
  };
  userHashedId: any;
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
      // this.getAllowedgetAllowedNationalities();
    
      this.user = history.state?.userData;
      console.log('Received user data:', this.user);
    
      if (this.user) {
        this.email = this.user.email || '';
        this.firstName = this.user.first_name || '';
        this.lastName = this.user.last_name || '';
        this.mobileCountryCode = (this.user.mobile_country_code || '').trim();
        this.mobile = this.user.mobile || '';
        this.preferredName = this.user.preferred_name || '';
        this.userHashedId = this.user.userHashedId || '';
        this.nationality = this.user.nationality || '';
        this.selectedPanterCode = this.user.partnerCode || '';
        this.roleid = this.user.role?._id || ''; 
        this.status = this.user.status ? true : false; 
        this.vr_card_fee = this.user.vr_card_fee ||0;
        this.py_card_fee = this.user.py_card_fee || 0;
        this.load_balance_fee = this.user.load_balance_fee || 0;
        this.master_load_balance= this.user.master_load_balance || 0;
        this.tranfer_fee = this.user.tranfer_fee || 0;
        this.kyc_fee = this.user.kyc_fee || 0;
        this.isActive_fee = this.user.isActive_fee || 0;
        this.inActive_fee = this.user.inActive_fee || 0;
          this.transaction_fee = this.user.transaction_fee || 0;
        this.password = this.user.password; // If the API actually returns plaintext
        const dialCode = this.user.mobile_country_code.startsWith('+')
        ? this.user.mobile_country_code
        : '+' + this.user.mobile_country_code;
      this.mobile = dialCode + this.user.mobile; // e.g. '+911234567890'
        // Save a copy for comparison (ensure keys match your usage)
        this.originalUserData = {
          _id: this.user._id,
          email: this.email,
          password: '', // if password is loaded or left blank if not edited
          firstName: this.firstName,
          lastName: this.lastName,
          mobileCountryCode: this.mobileCountryCode,
          mobile: this.mobile,
          preferredName: this.preferredName,
          nationality: this.nationality,
          selectedPanterCode: this.selectedPanterCode,
          roleid: this.roleid,
          status: this.status,
          py_card_fee: this.py_card_fee,
          vr_card_fee: this.vr_card_fee,
          load_balance_fee: this.load_balance_fee,
          master_load_balance: this.master_load_balance,
          tranfer_fee: this.tranfer_fee,
          kyc_fee: this.kyc_fee,
          isActive_fee: this.isActive_fee,
          inActive_fee: this.inActive_fee,
          transaction_fee: this.transaction_fee

          // Add additional fields as needed
        };
      
    
        console.log('Original user data:', this.originalUserData);
      } else {
        console.error('No user data received');
      }
    }
    
    
    
    // onMobileChange(event: any) {
    //   // event includes { number, internationalNumber, nationalNumber, e164Number, countryCode, dialCode }
    //   this.mobileCountryCode = event.dialCode;  // e.g. +91
    //   this.mobile = event.number;               // e.g. the user-typed phone number (without dial code)
    //   // or you can keep storing e164Number if your backend expects full phone numbers
    //   console.log('Dial Code:', this.mobileCountryCode, 'Number:', this.mobile);
    // }
    
     // Method to fetch clients
  fetchAllClients() {
    this.adminService.getAllClients().subscribe(
      (clients) => {
        this.roles = clients; // Assuming the API response has the roles
        console.log('Clients:', clients);
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['/user']); 
  }
  
    fetchRoles() {
      this.adminService.getRoles().subscribe({
        next: (response) => {
          this.roles = response;
          console.log(this.roles);
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

    
  
    onSubmit() {
      const createdBy = localStorage.getItem('AdminID');
    
      // Password validation regex
      // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
      // // Validate password (if the user entered a new one)
      // if (this.password && !passwordRegex.test(this.password)) {
      //   this.toastr.error(
      //     'Password must be at least 8 characters long and include at least one letter and one number.'
      //   );
      //   return; // Stop further execution
      // }
    
      // Create an object to hold only updated fields
      const updatedData: any = {};
    
      // Compare each field with the original and add to updatedData if changed
      if (this.email !== this.originalUserData.email) {
        updatedData.email = this.email.toLowerCase(); // Convert email to lowercase
      }
      
      // Include password if the user has provided one (or if you want to update it)
      // if (this.password && this.password !== this.originalUserData.password) {
      //   updatedData.password = this.password;
      // }
      
      if (this.firstName !== this.originalUserData.firstName) {
        updatedData.first_name = this.firstName;
      }
      
      if (this.lastName !== this.originalUserData.lastName) {
        updatedData.last_name = this.lastName;
      }
      
      // For mobileCountryCode, remove '+' if present and compare
      // const formattedMobileCountryCode = this.mobileCountryCode.startsWith('+')
      //   ? this.mobileCountryCode.substring(1)
      //   : this.mobileCountryCode;
      // if (formattedMobileCountryCode !== this.originalUserData.mobileCountryCode.replace('+','').trim()) {
      //   updatedData.mobile_country_code = formattedMobileCountryCode;
      // }
      
      if (this.mobile !== this.originalUserData.mobile) {
        updatedData.mobile = this.mobile;
      }
      
      if (this.preferredName !== this.originalUserData.preferredName) {
        updatedData.preferred_name = this.preferredName;
        updatedData.CategoryName = this.preferredName; // If both fields need update
      }
      
      if (this.nationality !== this.originalUserData.nationality) {
        updatedData.nationality = this.nationality;
      }
      
      if (this.selectedPanterCode !== this.originalUserData.selectedPanterCode) {
        updatedData.partnerCode = this.selectedPanterCode;
      }
      
      // if (this.roleid !== this.originalUserData.roleid) {
      
      // }
      
      if (this.status !== this.originalUserData.status) {
        updatedData.status = this.status;
      }
      if (this.vr_card_fee !== this.originalUserData.vr_card_fee) {
        updatedData.vr_card_fee = this.vr_card_fee;
      }
      if (this.py_card_fee !== this.originalUserData.py_card_fee) {
        updatedData.py_card_fee = this.py_card_fee;
      }
      if (this.load_balance_fee !== this.originalUserData.load_balance_fee) {
        updatedData.load_balance_fee = this.load_balance_fee;
      }
      if (this.master_load_balance !== this.originalUserData.master_load_balance) {
        updatedData.master_load_balance = this.master_load_balance;
      }
      if (this.tranfer_fee !== this.originalUserData.tranfer_fee) {
        updatedData.tranfer_fee = this.tranfer_fee;
      }
      if (this.kyc_fee !== this.originalUserData.kyc_fee) {
        updatedData.kyc_fee = this.kyc_fee;
      }

      if(this.isActive_fee !== this.originalUserData.isActive_fee) {
        updatedData.isActive_fee = this.isActive_fee; 
      }
      if(this.inActive_fee !== this.originalUserData.inActive_fee) {  
        updatedData.inActive_fee = this.inActive_fee;
      }

       if (this.transaction_fee !== this.originalUserData.transaction_fee) {
        updatedData.transaction_fee = this.transaction_fee;
      }
      // If user typed something in password, then validate & update
// if (this.password) {
//   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//   if (!passwordRegex.test(this.password)) {
//     this.toastr.error(
//       'Password must be at least 8 characters long and include at least one letter and one number.'
//     );
//     return;
//   }
//   // If it passes validation, include it in the update
//   updatedData.password = this.password;
// }

      
      // Optionally include additional fields if needed
      // For instance: updatedData.modifiedBy = createdBy;
      // updatedData.userhid = this.userHashedId;
      // updatedData.roleId = this.roleid;
      console.log('Updated data (only changed fields):', updatedData);
    
      // If nothing changed, you might not want to call the API
      if (Object.keys(updatedData).length === 0) {
        this.toastr.info('No changes detected.');
        return;
      }
    
      // Use adminId if it differs from createdBy (adjust as necessary)
    
    
      // Call the update API with only changed fields
      // this.adminService.updateAdmin(updatedData, this.originalUserData._id).subscribe({
      //   next: (response) => {
      //     this.toastr.success('Admin updated successfully!');
      //     this.router.navigate(['/user']);
      //   },
      //   error: (err) => {
      //     this.toastr.error('Failed to update admin. Please try again.');
      //     console.error('Update failed:', err);
      //   },
      // });
    }
    
}
