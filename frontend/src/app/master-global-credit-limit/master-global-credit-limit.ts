import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService, CreditLimitDto, TransactionLimitDto } from '../services/limit';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-master-global-credit-limit',
  templateUrl: './master-global-credit-limit.html',
  styleUrls: ['./master-global-credit-limit.css'],
  standalone: false
})
export class MasterGlobalCreditLimit implements OnInit {
  form!: FormGroup;
  savingCredit = false;
  savingTxn = false;

  constructor(
    private fb: FormBuilder,
    private limitService: LimitService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // One form with nested groups for both sections
    this.form = this.fb.group({
      credit: this.fb.group({
        limit: [null, [Validators.required, Validators.min(0)]]
      }),
      transaction: this.fb.group({
        cashLimit: [null, [Validators.required, Validators.min(0)]],
        bankLimit: [null, [Validators.required, Validators.min(0)]]
      })
    });

    this.loadAll();
  }

  // Load both in one go
  loadAll(): void {
    // Credit
    this.limitService.getCreditLimit().subscribe({
      next: (data: CreditLimitDto) => {
        this.form.get('credit')?.patchValue({ limit: data?.limit ?? 0 });
      },
      error: () => this.toastr.error('Failed to fetch credit limit')
    });

    // Transaction
    this.limitService.getTransactionLimit().subscribe({
      next: (data: TransactionLimitDto) => {
        this.form.get('transaction')?.patchValue({
          cashLimit: data?.cashLimit ?? 0,
          bankLimit: data?.bankLimit ?? 0
        });
      },
      error: () => this.toastr.error('Failed to fetch transaction limits')
    });
  }

  updateCredit(): void {
    const grp = this.form.get('credit') as FormGroup;
    if (!grp || grp.invalid) return;

    this.savingCredit = true;
    const payload: CreditLimitDto = { limit: +grp.value.limit };

    this.limitService.updateCreditLimit(payload).subscribe({
      next: () => {
        this.savingCredit = false;
        this.toastr.success('Credit limit updated');
      },
      error: () => {
        this.savingCredit = false;
        this.toastr.error('Error updating credit limit');
      }
    });
  }

  updateTransaction(): void {
    const grp = this.form.get('transaction') as FormGroup;
    if (!grp || grp.invalid) return;

    this.savingTxn = true;
    const payload: TransactionLimitDto = {
      cashLimit: +grp.value.cashLimit,
      bankLimit: +grp.value.bankLimit
    };

    this.limitService.updateTransactionLimit(payload).subscribe({
      next: () => {
        this.savingTxn = false;
        this.toastr.success('Transaction limits updated');
      },
      error: () => {
        this.savingTxn = false;
        this.toastr.error('Error updating transaction limits');
      }
    });
  }
}