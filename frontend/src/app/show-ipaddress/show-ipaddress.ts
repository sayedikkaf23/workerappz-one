import { Component } from '@angular/core';
import { Admin} from '../services/admin';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-ipaddress',
  standalone: false,
  templateUrl: './show-ipaddress.html',
  styleUrl: './show-ipaddress.css'
})
export class ShowIpaddress {
  
  mac_address = '';
  description = '';
  isActive = true;
  isLoading = false;

  constructor(
    private adminService: Admin,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    if (!this.mac_address.trim()) {
      this.toastr.error('MAC Address is required');
      return;
    }

    const payload = {
      mac_address: this.mac_address.trim(),
      description: this.description.trim(),
      isActive: this.isActive
    };

    this.isLoading = true;
    this.adminService.addIpAddress(payload).subscribe({
      next: () => {
        this.toastr.success('MAC Address added!');
        this.isLoading = false;
        this.router.navigate(['/addip']);  // adjust to your listing route
      },
      error: err => {
        console.error(err);
        this.toastr.error('Failed to add MAC Address');
        this.isLoading = false;
      }
    });
  }

}
