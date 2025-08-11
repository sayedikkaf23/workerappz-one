import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import your real service
// import { Admin } from '../services/admin';

@Component({
  selector: 'app-master-global-credit-limit',
  templateUrl: './master-global-credit-limit.html',
  styleUrls: ['./master-global-credit-limit.css'],
  standalone: false
})
export class MasterGlobalCreditLimit implements OnInit {
  form!: FormGroup;
  saving = false;
  savedMsg = '';

  constructor(
    private fb: FormBuilder,
    // private admin: Admin
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      limit: [null, [Validators.required, Validators.min(0)]]
    });

    // TODO: load current value from API
    // this.admin.getGlobalCreditLimit().subscribe(v => this.form.patchValue({ limit: v }));
  }

  update(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.savedMsg = '';

    const payload = { limit: +this.form.value.limit };

    // TODO: replace with real API call
    setTimeout(() => {
      this.saving = false;
      this.savedMsg = 'Global credit limit updated successfully.';
    }, 700);

    // Example real call:
    // this.admin.updateGlobalCreditLimit(payload).subscribe({
    //   next: () => { this.saving = false; this.savedMsg = 'Updated successfully.'; },
    //   error: () => { this.saving = false; this.savedMsg = 'Update failed. Try again.'; }
    // });
  }
}
