import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { LimitService } from '../services/limit';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-global-credit-limit',
  templateUrl: './master-global-credit-limit.html',
  styleUrls: ['./master-global-credit-limit.css'],
  standalone: false
})
export class MasterGlobalCreditLimit implements OnInit {
  form!: FormGroup;

  // loaders
  loading = false;  // for initial GET
  saving  = false;  // for UPDATE

  constructor(
    private fb: FormBuilder,
    private limitService: LimitService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      creditLimitInUSD: [null, [Validators.required, Validators.min(0)]],
      transactionLimitInUSD: [null, [Validators.required, Validators.min(0)]],
      transactionLimitInUSD_Bank: [null, [Validators.required, Validators.min(0)]],
      wallet: [null, [Validators.required, Validators.min(0)]],
      // if you truly need “Remember me should be Mandatory”, make it required:
      // rememberMe: [true, [Validators.requiredTrue]]
    });

    this.loadTransactionLimit();
  }

  loadTransactionLimit(): void {
    this.loading = true;
    this.limitService.getCreditLimit()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        (data) => {
          // Handle “logical” errors returned with 200
          if (data?.resCode && data.resCode !== 200) {
            this.toastr.error(data?.resMessage || 'Something went wrong.');
            return;
          }

          const row = data?.resData?.[0] || {};
          this.form.patchValue({
            id: row?.id ?? null,
            creditLimitInUSD: row?.creditLimitInUSD ?? null,
            transactionLimitInUSD: row?.transactionLimitInUSD ?? null,
            transactionLimitInUSD_Bank: row?.transactionLimitInUSD_Bank ?? null,
            wallet: row?.wallet ?? null,
          });

          // show backend message if present, else a simple “Loaded.”
          this.toastr.success(data?.resMessage || 'Loaded.');
        },
        (error) => {
          this.toastr.error(
            error?.error?.resMessage || error?.error?.message || error?.message || 'Error fetching transaction limit.'
          );
          console.error('GET error:', error);
        }
      );
  }

  update(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Please fill all required fields.');
      return;
    }

    this.saving = true;
    this.limitService.updateTransactionLimit(this.form.value)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(
        (data) => {
          // Handle “logical” errors returned with 200
          if (data?.resCode && data.resCode !== 200) {
            this.toastr.error(data?.resMessage || 'Update failed.');
            return;
          }

          // Use dynamic message if provided; else show your exact fallback text
          this.toastr.success(
            data?.resMessage || 'Global Limits Updated successfully - Toaster!'
          );
        },
        (error) => {
          this.toastr.error(
            error?.error?.resMessage || error?.error?.message || error?.message || 'Error updating transaction limit.'
          );
          console.error('UPDATE error:', error);
        }
      );
  }
}
