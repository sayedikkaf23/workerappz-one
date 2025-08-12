import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LimitService, TransactionLimitDto } from '../services/limit'; // Import the service
import { ToastrService } from 'ngx-toastr'; // Import ToastrService for notifications

@Component({
  selector: 'app-master-global-transaction-limit',
  templateUrl: './master-global-transaction-limit.html',
  styleUrls: ['./master-global-transaction-limit.css'],
  standalone: false,
})
export class MasterGlobalTransactionLimit implements OnInit {
  form!: FormGroup;
  saving = false;
  savedMsg = '';

  constructor(
    private fb: FormBuilder,
    private limitService: LimitService,
    private toastr: ToastrService // Inject ToastrService for toast notifications
  ) {}

  ngOnInit(): void {
    // Initialize the form group
    this.form = this.fb.group({
      cashLimit: [null, [Validators.required, Validators.min(0)]],
      bankLimit: [null, [Validators.required, Validators.min(0)]],
    });

    // Load current limits from the API
    this.loadTransactionLimits();
  }

  loadTransactionLimits(): void {
    this.limitService.getTransactionLimit().subscribe(
      (data: TransactionLimitDto) => {
        console.log('Fetched data from API:', data);
        this.form.patchValue({
          cashLimit: data.cashLimit,
          bankLimit: data.bankLimit,
        });
        console.log('Form Value After patchValue:', this.form.value);
      },
      (error) => {
        this.toastr.error(
          'Error fetching transaction limits. Please try again.'
        );
      }
    );
  }

  update(): void {
    if (this.form.invalid) return;

    this.saving = true;
    this.savedMsg = '';

    const payload = {
      cashLimit: +this.form.value.cashLimit,
      bankLimit: +this.form.value.bankLimit,
    };

    this.limitService.updateTransactionLimit(payload).subscribe(
      (response) => {
        this.saving = false;
        // this.savedMsg = 'Transaction limits updated successfully.';
        this.toastr.success('Transaction limits updated successfully.');
      },
      (error) => {
        this.saving = false;
        // this.savedMsg = 'Error updating transaction limits. Please try again.';
        this.toastr.error(
          'Error updating transaction limits. Please try again.'
        );
      }
    );
  }
}
