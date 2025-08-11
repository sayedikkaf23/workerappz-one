import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService, CreditLimitDto } from '../services/limit';  // Import the service

@Component({
  selector: 'app-master-global-credit-limit',
  templateUrl: './master-global-credit-limit.html',
  styleUrls: ['./master-global-credit-limit.css'],
  standalone: false
})
export class MasterGlobalCreditLimit implements OnInit {
  form!: FormGroup;  // Form to hold the input values
  saving = false;  // Track the saving state
  savedMsg = '';  // Track the success message

  constructor(
    private fb: FormBuilder,  // FormBuilder to manage reactive forms
    private limitService: LimitService  // Service to interact with the backend API
  ) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.form = this.fb.group({
      limit: [null, [Validators.required, Validators.min(0)]]  // Limit should be required and greater than 0
    });

    // Load the current credit limit from the API
    this.loadCreditLimit();
  }

  // Method to load the current credit limit
  loadCreditLimit(): void {
    this.limitService.getCreditLimit().subscribe(
      (data: CreditLimitDto) => {
        // Patch the form with the current limit value
        this.form.patchValue({
          limit: data.limit
        });
      },
      (error) => {
        console.error('Error fetching credit limit:', error);
      }
    );
  }

  // Method to update the global credit limit
  update(): void {
    if (this.form.invalid) return;  // Don't submit if the form is invalid

    this.saving = true;  // Set saving state to true while the request is in progress
    this.savedMsg = '';  // Reset the saved message

    const payload = { limit: +this.form.value.limit };  // Get the limit value from the form

    // Call the service to update the credit limit
    this.limitService.updateCreditLimit(payload).subscribe(
      (response) => {
        this.saving = false;  // Set saving state to false after the request completes
        this.savedMsg = 'Global credit limit updated successfully.';  // Set the success message
      },
      (error) => {
        this.saving = false;  // Set saving state to false if an error occurs
        this.savedMsg = 'Error updating credit limit. Please try again.';  // Set the error message
      }
    );
  }
}
