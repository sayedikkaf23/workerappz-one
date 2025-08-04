import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Admin } from '../services/admin';

@Component({
  selector: 'app-topup',
  standalone: false,
  templateUrl: './topup.html',
  styleUrl: './topup.css'
})
export class Topup {
  from: string = '' ; // Fixed value
  to: string = '';
  amount: number | null = null;
  modalOpen: boolean = false;
  adminRole: string = '';
  partnerCode: string = '';
  users: any;
  roles: any;
  isLoading:boolean =false
  totalAmount: number = 0;
  constructor(
    private toastr: ToastrService,
    private adminService: Admin
  ) {}

  ngOnInit(): void {
    this.adminRole = localStorage.getItem('AdminRole') || '';
    this.from= localStorage.getItem('adminEmail') || '';
    this.partnerCode = localStorage.getItem('partnerCode') || '';

    if (!this.adminRole || this.adminRole === 'superadmin' || this.adminRole === 'administrator') {
      // this.loadUsers();
      this.fetchAllClients();
    } else {
      this.loadUsersByPartnerCode(this.partnerCode); // Load wallets for specific partner
    }
  }

  fetchAllClients() {
    // Retrieve the admin email from localStorage (or wherever it is stored)
    const adminEmail = localStorage.getItem('adminEmail');

    this.adminService.getAllClients().subscribe(
      (clients) => {
        // If adminEmail exists, filter out the client that matches it
        if (adminEmail) {
          const fromEmail = this.from; // Assuming this.from holds the email of the user

          this.roles = clients.filter((client:any) => client.email !== adminEmail);
          const client = clients.find((client:any) => client.email === fromEmail);
         
          if (client) {
           this.totalAmount = client.totalAmount; // Assuming each client object has a totalAmount property
          }
        } else {
          this.roles = clients;
        }
        console.log('Clients:', this.roles);
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  onSubmit() {
    // Validate input
    if (!this.to || !this.amount || this.amount <= 0) {
      this.toastr.error(
        'Please provide a valid To email address and a positive amount.'
      );
      return;
    }

    const payload = {
      from: this.from,
      to: this.to,
      amount: this.amount.toString(),
      fromtotalAmount: this.totalAmount
    };

    this.isLoading = true; // Show loading spinner

    // Call the topUp API directly
    this.adminService.topUp(payload).subscribe({
      next: (response) => {
        this.toastr.success('Top-up completed successfully!');
        console.log('Top-up Success:', response);
        this.isLoading = false; 
        this.resetForm(); 
      },
      error: (error) => {
        const errorMessage = error?.error?.details || error?.error?.error || 'Failed to complete top-up. Please try again.';
        this.toastr.error(errorMessage);
        console.error('Top-up Error:', error);
        this.isLoading = false; 
      },
    });
    
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUser().subscribe(
      (response) => {
        this.users = response.data || []; // Handle cases when data is empty
        // this.filterUsers(); // Apply search and pagination
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
    this.adminService.loadUsersByPartnerCode(partnerCode).subscribe(
      (response) => {
        this.users = response.data || []; // Handle cases when data is empty
        // this.filterUsers(); // Apply search and pagination
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  // Reset form after successful top-up
  private resetForm() {
    this.to = '';
    this.amount = null;
  }
}
