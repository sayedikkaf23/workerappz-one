import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService } from '../services/limit'; // Import the service to interact with the backend API
import { ToastrService } from 'ngx-toastr';

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
    private limitService: LimitService , // Service to interact with the backend API,
    private toastr: ToastrService,

  ) {}
ngOnInit(): void {
  this.form = this.fb.group({
    id: [null],
    creditLimitInUSD: [null, [Validators.required, Validators.min(0)]],
    transactionLimitInUSD: [null, [Validators.required, Validators.min(0)]],
    transactionLimitInUSD_Bank: [null, [Validators.required, Validators.min(0)]],
    wallet: [null, [Validators.required, Validators.min(0)]]
  });

  this.loadTransactionLimit();
}

loadTransactionLimit(): void {
  this.limitService.getCreditLimit().subscribe(
    (data) => {
      // Handle "logical" errors that come with HTTP 200
      if (data?.resCode && data.resCode !== 200) {
        this.toastr.error(data?.resMessage || 'Something went wrong.');
        return;
      }

      this.toastr.success(data?.resMessage || 'Loaded.');
      const row = data?.resData?.[0] || {};
      this.form.patchValue({
        id: row?.id ?? null,
        creditLimitInUSD: row?.creditLimitInUSD ?? null,
        transactionLimitInUSD: row?.transactionLimitInUSD ?? null,
        transactionLimitInUSD_Bank: row?.transactionLimitInUSD_Bank ?? null,
        wallet: row?.wallet ?? null,
      });
    },
    (error) => {
      this.toastr.error(
        error?.error?.resMessage || error?.message || 'Error fetching transaction limit.'
      );
      console.error('Error:', error);
    }
  );
}

update(): void {
  if (this.form.invalid) return;

  this.saving = true;
  this.limitService.updateTransactionLimit(this.form.value).subscribe(
    (data) => {
      this.saving = false;

      // Handle "logical" errors that come with HTTP 200
      if (data?.resCode && data.resCode !== 200) {
        this.toastr.error(data?.resMessage || 'Update failed.');
        return;
      }

      this.toastr.success(data?.resMessage || 'Updated.');
    },
    (error) => {
      this.saving = false;
      this.toastr.error(
        error?.error?.resMessage || error?.message || 'Error updating transaction limit.'
      );
      console.error('Error:', error);
    }
  );
}
}
