import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Admin } from '../services/admin';
import { AdminService } from '../services/admin.service';
import { ViewBusinessUserModal } from '../view-business-user-modal/view-business-user-modal';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../services/auth';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-business-user',
  standalone: false,
  templateUrl: './business-user.html',
  styleUrl: './business-user.css'
})
export class BusinessUser implements OnInit {
  searchTerm: string = '';
  partnerCode: string = '';
  cards: any[] = [];
  filteredCards: any[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
users: any;
  constructor(
    private adminService: Admin,
    private admin: AdminService,
    private dialog: MatDialog,
    private authService: Auth,
    private toastr: ToastrService
  ) {}

  ngOnInit() {

    this.partnerCode = localStorage.getItem('partnerCode') || ''; // Fetch partner code from localStorage
    this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
  


    const adminRole = localStorage.getItem('AdminRole');

    if (adminRole === 'administrator'){

   this.partnerCode = "superadmin"
      
    }
  this.admin.getAllIndividualUsers().subscribe({
      next: (res) => {
        // If backend returns {count, data}
        this.users = res.data || res;
        console.log("RES: ",this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
    // this.simulateLoading();
    // this.fetchCards();

  }

  simulateLoading() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get paginatedCards() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCards.slice(startIndex, endIndex);
  }

  fetchCards() {
     this.isLoading = true;
    this.adminService.getAllBusinessUsers(this.partnerCode).subscribe(
      (response) => {
        // Reverse the array so that the most recent items appear first
        this.cards = response.reverse();
        this.filteredCards = this.cards; // Initialize filteredCards with the reversed array
        this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching cards:', error);
        this.isLoading = false;
      }
    );
  }
  

  openBusinessViewModal(card: any) {
    const dialogRef = this.dialog.open(ViewBusinessUserModal, {
      width: '400px',
      data: card
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal closed with result:', result);
    });
  }

  approve(selectedEmail:any) {
    console.log('Email:', selectedEmail);
    if (!selectedEmail) {
      this.toastr.error('Please enter an email address.');
      return;
    }

    this.authService.ApproveSubAccount(selectedEmail).subscribe(
      // response => {
      //   console.log('Approval response:', response);
      //   this.toastr.success(response.message);
      //   this.fetchCards();
      // },
      // error => {
      //   console.error('Error while approving subaccount:', error);
      //   if (error.error && error.error.message) {
      //     this.toastr.error(error.error.message.errorCode);
      //   } else {
      //     this.toastr.error('Error while approving subaccount. Please try again later.');
      //   }
      // }
    );
  }
exportToExcel() {
  const tableData = this.filteredCards.map((card, index) => ({
    No: index + 1,
    Name: card.name,
    Email: card.email,
    Mobile: card.mobileNumber?.internationalNumber || '',
    Status: card.isApprove ? 'Approved' : 'Pending',
    Date: new Date(card.createdAt).toLocaleDateString(), // e.g., "2025-07-02"
    Time: new Date(card.createdAt).toLocaleTimeString()  // e.g., "15:22:10"
  }));

  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'BusinessUsers');
  XLSX.writeFile(workbook, `BusinessUsers_${new Date().getTime()}.xlsx`);
}

  // exportToExcel() {
  //   // Use filteredCards data for export
  //   const tableData = this.filteredCards.map((card, index) => ({
  //     No: index + 1,
  //     Name: card.name,
  //     Email: card.email,
  //     Mobile: card.mobileNumber.internationalNumber,
  //     Status: card.isApprove ? 'Approved' : 'Pending'
  //   }));

  //    const worksheet = XLSX.utils.json_to_sheet(tableData);
  //       const workbook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(workbook, worksheet, 'BusinessUsers');
  //       XLSX.writeFile(workbook,  `BusinessUsers_${new Date().getTime()}.xlsx`); // This line handles the download

    
  // }

  // Search logic
  onSearch() {
    this.searchTerm = this.searchTerm.trim();
    if (this.searchTerm) {
      this.filteredCards = this.cards.filter(card =>
        card.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        card.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        card.mobileNumber.internationalNumber.includes(this.searchTerm)
      );
    } else {
      this.filteredCards = this.cards;
    }
    this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to the first page after search
  }
}
