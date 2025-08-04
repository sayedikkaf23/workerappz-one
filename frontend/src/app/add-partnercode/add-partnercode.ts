import { Component } from '@angular/core';
import { Admin } from '../services/admin';
import { Router } from '@angular/router'; // To redirect after submission
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService

@Component({
  selector: 'app-add-partnercode',
  standalone: false,
  templateUrl: './add-partnercode.html',
  styleUrl: './add-partnercode.css'
})
export class AddPartnercode {
   Partnercode: string = '';   // To bind with the pantercode input field
  status: string = '';       // To bind with the status dropdown
  companyname: string = '';  // To bind with the company name input field

  isLoading: boolean = false; // Loader flag

  constructor(
    private adminService: Admin, 
    private router: Router, 
    private toastr: ToastrService
  ) {}

  // Custom validator function to prevent spaces in the pantercode
  noSpacesValidator(input: string): boolean {
    return input.indexOf(' ') === -1;
  }

  // Add the onSubmit method to handle form submission
  onSubmit(form: NgForm) {
    // Validate pantercode to ensure no spaces are present
    if (!this.noSpacesValidator(this.Partnercode)) {
      this.toastr.error('Partner Code cannot contain spaces.', 'Validation Error');
      return; // Prevent form submission if validation fails
    }

    this.isLoading = true; // Start loader

    // Call the AdminService to send data to the backend
    this.adminService.addPanterCode(this.Partnercode, this.status, this.companyname).subscribe(
      (response) => {
        // Directly display the exact success message from the response
        if (response?.message) {
          this.toastr.success(response.message); 
        }
        this.isLoading = false; // Stop loader

        // Redirect to the partner code page
        this.router.navigate(['/partnercode']);
      },
      (error) => {
        // Directly display the exact error message from the response
        if (error?.error?.message) {
          this.toastr.error(error.error.message);
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
        console.error('Error adding Partner Code:', error);
        this.isLoading = false; // Stop loader
      }
    );
  }
}
