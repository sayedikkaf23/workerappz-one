import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Admin } from '../services/admin';
import { Transfer } from '../services/transfer';


@Component({
  selector: 'app-transferfund',
  standalone: false,
  templateUrl: './transferfund.html',
  styleUrl: './transferfund.css'
})
export class Transferfund {
  from: string = 'admin@gmail.com'; // Fixed value
  to: string = '';
  amount: number | null = null;

  isLoading: boolean = false;
  modalOpen: boolean = false; // For applying blur when a modal is open
  users: any;
  adminRole: string = '';
  partnerCode: string = '';
  adminHashedId: string = '';
  selectedCategory: string = '';
  
  constructor(
    private toastr: ToastrService,
    private adminService: Admin,
    private transferService: Transfer
  ) {}

  ngOnInit(): void {
    // this.adminRole = localStorage.getItem('AdminRole') || null;
    // this.from = localStorage.getItem('adminEmail');
    // this.partnerCode = localStorage.getItem('partnerCode');
    // this.adminHashedId = localStorage.getItem('adminHashedId');

    // if (!this.adminRole || this.adminRole === 'superadmin' || this.adminRole === 'administrator') {
    //   this.loadUsers();
    // } else {
    //   this.loadUsersByPartnerCode(this.partnerCode);
    // }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllClient().subscribe(
      (response) => {
        this.users = response.data || []; // Handle cases when data is empty
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }
  
  loadUsersByPartnerCode(partnerCode: any): void {
    this.isLoading = true;
    this.adminService.getAllClientByPartnerCode(partnerCode).subscribe(
      (response) => {
        this.users = response.data || []; // Handle cases when data is empty
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
     if (this.partnerCode == "superadmin") {
      this.toastr.error('You dont have priveliged to transfer funds to customer. Please contact administrator.');
      return;
    }
    // Validate input
    if (!this.to || !this.amount || this.amount <= 0) {
      this.toastr.error('Please try from the Master Account.');
      return;
    }

    const createContactData = {
      email: this.to,
      amount: this.amount,
      fund_category_name: this.selectedCategory || "DEFAULT"
    };

    this.isLoading = true; // Start loader
    this.transferService.createPayment(createContactData, this.adminHashedId).subscribe({
      next: (response) => {
        this.toastr.success('Top-up completed successfully!');
        console.log('Top-up Success:', response);
        this.isLoading = false; // Stop loader
        this.resetForm();
      },
      error: (error) => {
        this.toastr.error('Failed to complete top-up. Please try again.');
        console.error('Top-up Error:', error);
        this.isLoading = false; // Stop loader
      }
    });
  }

  // Reset form after successful top-up
  private resetForm() {
    this.to = '';
    this.amount = null;
  }
}
