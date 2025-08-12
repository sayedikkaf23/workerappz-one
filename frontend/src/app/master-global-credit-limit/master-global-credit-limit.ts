import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LimitService, CreditLimitDto, TransactionLimitDto } from '../services/limit';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-master-global-credit-limit',
  templateUrl: './master-global-credit-limit.html',
  styleUrls: ['./master-global-credit-limit.css'],
  standalone: false
})
export class MasterGlobalCreditLimit implements OnInit {
  form!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private limitService: LimitService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      creditLimit: [null, [Validators.required, Validators.min(0)]],
      cashLimit:   [null, [Validators.required, Validators.min(0)]],
      bankLimit:   [null, [Validators.required, Validators.min(0)]],
      walletLimit: [null, [Validators.required, Validators.min(0)]], // new
    });

    this.loadAll();
  }

  loadAll(): void {
    forkJoin({
      credit: this.limitService.getCreditLimit().pipe(catchError(() => of({ limit: 0 } as CreditLimitDto))),
      txn:    this.limitService.getTransactionLimit().pipe(catchError(() => of({ cashLimit: 0, bankLimit: 0, walletLimit: 0 } as any))),
      // If you already have a dedicated wallet endpoint, also include it here and map to walletLimit.
    }).subscribe(({ credit, txn }: any) => {
      this.form.patchValue({
        creditLimit: credit?.limit ?? 0,
        cashLimit:   txn?.cashLimit ?? 0,
        bankLimit:   txn?.bankLimit ?? 0,
        walletLimit: txn?.walletLimit ?? 0, // fallback to 0 if API doesn't yet return it
      });
    }, _ => this.toastr.error('Failed to fetch limits'));
  }

  saveAll(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    this.saving = true;

    // Option A: your backend accepts walletLimit in the same transaction payload
    const txnPayload: TransactionLimitDto & { walletLimit?: number } = {
      cashLimit: +v.cashLimit,
      bankLimit: +v.bankLimit,
      walletLimit: +v.walletLimit
    };

    const creditReq = this.limitService.updateCreditLimit({ limit: +v.creditLimit });
    const txnReq    = this.limitService.updateTransactionLimit(txnPayload as any);

    // If your API has a separate wallet endpoint, replace txnReq with forkJoin of txn + wallet.
    forkJoin([creditReq, txnReq])
      .pipe(catchError(err => { this.toastr.error('Save failed'); throw err; }))
      .subscribe({
        next: () => {
          this.saving = false;
          this.toastr.success('Limits updated');
        },
        error: () => { this.saving = false; }
      });
  }
}
