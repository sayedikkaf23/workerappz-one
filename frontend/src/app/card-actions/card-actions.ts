import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Admin } from '../services/admin';
// import { ViewUserModalComponent } from '../view-user-modal/view-user-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../services/auth';
// import * as XLSX from 'xlsx'; // Import XLSX for Excel export

@Component({
  selector: 'app-card-actions',
  standalone: false,
  templateUrl: './card-actions.html',
  styleUrl: './card-actions.css'
})
export class CardActions implements OnInit {
  cards = [];
  filteredCards = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  searchTerm: string = ''; // Search term property
  partnerCode: string = ''; // Search term property
  fromDate: string = '';
  toDate: string = '';
  constructor(
    private adminService: Admin,
    private dialog: MatDialog,
    private authService: Auth,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.partnerCode = localStorage.getItem('partnerCode') || ''; // Fetch partner code from localStorage

    this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
    // this.simulateLoading();
    // this.fetchCards();
    const adminRole = localStorage.getItem('AdminRole');

    if (adminRole === 'administrator') {
      this.partnerCode = 'superadmin';
    }
    this.fetchCards();
    // this.simulateLoading();
    // this.fetchPanterCodes();
  }

  fetchCards() {
    this.isLoading = true;
    this.adminService.getAllUsers(this.partnerCode).subscribe(
      (response: any) => {
        // Sort by createdAt descending
        this.cards = response.sort(
          (a: any, b:any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        // Initialize your filtered list (already sorted)
        this.filteredCards = [...this.cards];
        this.totalPages = Math.ceil(
          this.filteredCards.length / this.itemsPerPage
        );
        this.isLoading = false;
        // Reverse the array so that recent data appears first
        // this.cards = response.reverse();
        // this.filteredCards = this.cards;  // Initialize filteredCards with the reversed array
        // this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
        // this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching cards:', error);
        this.isLoading = false;
      }
    );
  }

exportToExcel(): void {
  const data = this.filteredCards.map((card, index) => ({
    // No: index + 1,
    // FirstName: card.firstname,
    // LastName: card.lastname,
    // Email: card.email,
    // Mobile: card.mobileNumber.internationalNumber,
    // Pre_KYC: card.isApprove ? 'Approved' : 'Rejected',
    // Post_KYC: card.postKyc,
    // Subprogram: card.companyname || 'NA',
    // RegistrationDate: card.createdAt ? new Date(card.createdAt).toLocaleDateString() : 'NA', // Registration Date
  }));

  // const ws = XLSX.utils.json_to_sheet(data);
  // const wb = XLSX.utils.book_new();

  // Set column widths for the new fields
  // ws['!cols'] = [
  //   { wch: 5 }, // No.
  //   { wch: 20 }, // FirstName
  //   { wch: 20 }, // LastName
  //   { wch: 30 }, // Email
  //   { wch: 20 }, // Mobile
  //   { wch: 12 }, // Pre_KYC
  //   { wch: 12 }, // Post_KYC
  //   { wch: 25 }, // PartnerName
  //   { wch: 15 }, // RegistrationDate
  // ];

  // Optional: Apply some formatting to the "FirstName" column
  // data.forEach((_, i) => {
  //   const cell = ws['B' + (i + 2)];
  //   if (cell)
  //     cell.s = {
  //       alignment: { indent: 1, vertical: 'center' },
  //     };
  // });

  // XLSX.utils.book_append_sheet(wb, ws, 'Individual_User');
  // XLSX.writeFile(wb, 'Individual_User.xlsx');
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

  openViewModal(card: any) {
    // const dialogRef = this.dialog.open(ViewUserModalComponent, {
    //   width: '400px',
    //   data: card,
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('Modal closed with result:', result);
    // });
  }

  fetchPanterCodes() {
    this.adminService.getPanterCode().subscribe({
      next: (data: any) => {
        this.partnerCode = data.reduce((acc: any, item:any) => {
          acc[item.partnerCode] = item.companyname; // Create a mapping
          return acc;
        }, {});
      },
      error: (err: any) => console.error('Failed to fetch partner codes:', err),
    });
  }

  // Function to get company name from partnerCode
  getCompanyName(partnercode: any): string {
    return this.partnerCode[partnercode] || 'NA'; // Default value if not found
  }

  approve(selectedEmail: any) {
    console.log('Email:', selectedEmail);
    if (!selectedEmail) {
      this.toastr.error('Please enter an email address.');
      return;
    }

    this.authService.ApproveSubAccount(selectedEmail).subscribe(
      (response:any) => {
        console.log('Approval response:', response);
        this.toastr.success(response.message);
        this.fetchCards();
      },
      (error:any) => {
        console.error('Error while approving subaccount:', error);
        if (error.error && error.error.message) {
          this.toastr.error(error.error.message.errorCode);
        } else {
          this.toastr.error(
            'Error while approving subaccount. Please try again later.'
          );
        }
      }
    );
  }

  // Search logic
  onSearch() {
    this.searchTerm = this.searchTerm.trim();
    if (this.searchTerm) {
      // this.filteredCards = this.cards.filter(
      //   (card) =>
      //     // card.firstname
      //     //   .toLowerCase()
      //     //   .includes(this.searchTerm.toLowerCase()) ||
      //     // card.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      //     // card.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      //     // card.mobileNumber.internationalNumber.includes(this.searchTerm) ||
      //     // String(card.isApprove).toLowerCase().includes(this.searchTerm) || // Convert boolean to string
      //     // String(card.postKyc).toLowerCase().includes(this.searchTerm) ||
      //     // String(card.partnercode)
      //     //   .toLowerCase()
      //     //   .includes(this.searchTerm.toLowerCase()) ||
      //     // this.getCompanyName(card.partnercode)
      //     //   .toLowerCase()
      //     //   .includes(this.searchTerm.toLowerCase()) // Search by company name
      // );
    } else {
      this.filteredCards = this.cards;
    }
    this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to the first page after search
  }

 applyDateFilter(): void {
  let cards = [...this.cards];

  // // if user picked a from-date
  // if (this.fromDate) {
  //   const from = new Date(this.fromDate);
  //   cards = cards.filter((c) => new Date(c.createdAt) >= from);
  // }

  // // if user picked a to-date
  // if (this.toDate) {
  //   const to = new Date(this.toDate);
  //   to.setHours(23, 59, 59, 999); // Set the time to the end of the day
  //   cards = cards.filter((c) => new Date(c.createdAt) <= to);
  // }

  // // now apply search on top of that (optional)
  // if (this.searchTerm) {
  //   const term = this.searchTerm.toLowerCase();
  //   cards = cards.filter(
  //     (card) =>
  //       card.firstname.toLowerCase().includes(term) ||
  //       card.lastname.toLowerCase().includes(term) ||
  //       card.email.toLowerCase().includes(term)
  //   );
  // }

  // Commit filtered data
  this.filteredCards = cards;
  this.totalPages = Math.ceil(this.filteredCards.length / this.itemsPerPage);
  this.currentPage = 1;
}

  deleteUser(card: any) {
    if (
      confirm(
        `Are you sure you want to delete ${card.firstname} ${card.lastname}?`
      )
    ) {
      this.authService.deleteUser(card.userHashedId).subscribe(
        (response:any) => {
          console.log('User deleted successfully:', response);
          // this.fetchCards();
          // Optionally show a success notification, e.g., using Toastr:
          this.toastr.success('User deleted successfully');
          // Optionally update your list (e.g., remove the deleted card from paginatedCards)
          // this.paginatedCards = this.paginatedCards.filter((c: any) => c.userHashedId !== card.userHashedId);
        },
        (error:any) => {
          console.error('Error deleting user:', error);
          this.toastr.error('Error deleting user');
        }
      );
    }
  }
}
