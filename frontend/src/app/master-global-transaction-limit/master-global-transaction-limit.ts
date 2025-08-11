import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-master-global-transaction-limit',
  standalone: false,
  templateUrl: './master-global-transaction-limit.html',
  styleUrl: './master-global-transaction-limit.css'
})
export class MasterGlobalTransactionLimit {
 form!: FormGroup;
  saving = false;
  savedMsg = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cashLimit: [null, [Validators.required, Validators.min(0)]],
      bankLimit: [null, [Validators.required, Validators.min(0)]]
    });

    // Load existing values (replace with API call)
    // this.form.patchValue({ cashLimit: 5000000, bankLimit: 5000000 });
  }

  update(): void {
    if (this.form.invalid) return;

    this.saving = true;
    this.savedMsg = '';

    const payload = {
      cashLimit: +this.form.value.cashLimit,
      bankLimit: +this.form.value.bankLimit
    };

    // Simulate API call
    setTimeout(() => {
      this.saving = false;
      this.savedMsg = 'Transaction limits updated successfully.';
    }, 700);
  }
}