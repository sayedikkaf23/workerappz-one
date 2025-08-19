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
      this.form.patchValue({
        id: data.resData[0].id,
        
        creditLimitInUSD: data.resData[0].creditLimitInUSD,
        transactionLimitInUSD: data.resData[0].transactionLimitInUSD,
        transactionLimitInUSD_Bank: data.resData[0].transactionLimitInUSD_Bank,
        wallet: data.resData[0].wallet
      });
    },
    (error) => {
      this.toastr.error('Error fetching transaction limit.');
      console.error('Error:', error);
    }
  );
}

update(): void {
  if (this.form.invalid) return;

  this.saving = true;
  this.limitService.updateTransactionLimit(this.form.value).subscribe(
    () => {
      this.saving = false;
      this.toastr.success('Transaction limit updated successfully.');
    },
    (error) => {
      this.saving = false;
      this.toastr.error('Error updating transaction limit.');
      console.error('Error:', error);
    }
  );
}
}
