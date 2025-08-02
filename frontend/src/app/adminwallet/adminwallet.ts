import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { Admin } from '../services/admin';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-adminwallet',
  standalone: false,
  templateUrl: './adminwallet.html',
  styleUrl: './adminwallet.css',
    encapsulation: ViewEncapsulation.Emulated 
})
export class Adminwallet implements OnInit {
  searchTerm: string = '';
  // These properties will be strings in 'YYYY-MM-DD' format from the HTML5 date input.
  startDate: string | null = null;
  endDate: string | null = null;
  
  
  isLoading: boolean = false;
 

  wallet = []; // Data returned from the API for the current page
  filteredWallets = []; // In case you need to filter the current page's records
  currentPage: number = 1;
  limit: number = 10; // Number of records per API call
  totalPages: number = 1; // Calculated from API totalUsers
  totalUsers: number = 0;

  partnerCode: any;
  itemsPerPage: number = 10; 
 
  constructor(private adminService: Admin) {}
 
  ngOnInit(): void {
    const adminRole = localStorage.getItem('AdminRole');
    const partnerCode = localStorage.getItem('partnerCode');
    if (!adminRole || adminRole === 'superadmin' || adminRole === 'administrator') {
      this.loadwallet();
    } else {
      this.loadWalletByPartnerCode(partnerCode);
    }
  }
  loadwallet(): void {
    this.isLoading = true;
    this.adminService.getAllUserWallets(this.currentPage, this.limit).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.totalUsers = response.totalUsers || 0;
        this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
        this.wallet = response.userDetails || [];
  
        // Sort by most recent date
        // this.wallet.sort((a, b) => {
        //   const timeA = a.wallet?.date?.issued ? new Date(a.wallet.date.issued).getTime() : 0;
        //   const timeB = b.wallet?.date?.issued ? new Date(b.wallet.date.issued).getTime() : 0;
        //   return timeB - timeA;
        // });
  
        this.filteredWallets = this.wallet;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching wallets:', error);
        this.isLoading = false;
      }
    );
  }
  
  
  loadWalletByPartnerCode(partnerCode: string | null): void {
    if (!partnerCode) {
      console.warn('No partner code found, skipping API call.');
      return;
    }
    this.isLoading = true;
    this.adminService.getUserWalletsByPartnerCode(partnerCode, this.currentPage, this.limit)
      .subscribe(
        (response) => {
          console.log('Filtered API Response:', response);
          this.totalUsers = response.totalUsers || 0;
          this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
  
          this.wallet = response.userDetails || [];
  
          // Sort by most recent
          // this.wallet.sort((a, b) => {
          //   const dateA = new Date(a.wallet?.date?.issued);
          //   const dateB = new Date(b.wallet?.date?.issued);
          //   return dateB.getTime() - dateA.getTime();
          // });
  
          this.filteredWallets = this.wallet;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching wallets by partner code:', error);
          this.isLoading = false;
        }
      );
  }
  
  // Helper to calculate the overall index for display.
  getIndex(i: number): number {
    const cp = Number(this.currentPage) || 1;
    const ipp = Number(this.itemsPerPage) || 10;
    return ((cp - 1) * ipp) + (i + 1);
  }
 
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const adminRole = localStorage.getItem('AdminRole');
      const partnerCode = localStorage.getItem('partnerCode');
      if (!adminRole || adminRole === 'superadmin' || adminRole === 'administrator') {
        this.loadwallet();
      } else {
        this.loadWalletByPartnerCode(partnerCode);
      }
    }
  }
 
  // For server-side pagination, we don't need to slice again:
  get paginatedWallets() {
    return this.filteredWallets;
  }
 
  onSearch(): void {
    const trimmedSearchTerm = this.searchTerm.trim();
    // Reset page to 1 on new search
    this.currentPage = 1;
    this.isLoading = true;

    // Retrieve partnerCode from localStorage or other source if needed
    const partnerCode = localStorage.getItem('partnerCode');
    
    // Pass the date strings directly to your service
    this.adminService.searchUserWallets(
      partnerCode, 
      trimmedSearchTerm, 
      this.startDate, 
      this.endDate, 
      this.currentPage, 
      this.limit
    ).subscribe(
      (response) => {
        console.log('Search API Response:', response);
        // Use the totalUsers from the API to calculate total pages
        this.totalUsers = response.totalUsers || 0;
        this.totalPages = Math.ceil(this.totalUsers / this.itemsPerPage);
        // The API already returns paginated data, so assign it directly.
        this.wallet = response.userDetails || [];
        this.filteredWallets = this.wallet;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error searching wallets:', error);
        this.isLoading = false;
      }
    );
  }

  exportToExcel(): void {
          const partnerCode = localStorage.getItem('partnerCode');
 this.isLoading = true;
  // First, fetch the wallet data
  this.adminService.getUserWalletsByPartnerCode(partnerCode|| '', this.currentPage, -1)
    .subscribe((response) => {
      // Assuming response contains the user wallets and other necessary data
      const filteredWallets = response.userDetails;

      // Create the Excel worksheet based on the filtered wallets data
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredWallets.map((wallet:any, index:any) => ({
        'S.No': this.getIndex(index),
        Name: `${wallet.user.firstname} ${wallet.user.lastname}`,
        "Mail ID": wallet.user.email,
        "Wallet Number": wallet.wallet?.number || 'No wallet for user',
        "Date Issued": wallet.wallet?.date?.issued || 'N/A',
        Balance: wallet.wallet?.funds?.available?.amount || 'N/A',
        "Wallet Hash ID": wallet.wallet?.id || 'N/A',
        "Partner Name": wallet.companyname || 'N/A',
        "User Hash ID": wallet.user.userHashedId || 'N/A'
      })));

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Wallet');

      // Set column width for better readability
      const wscols = [
        { wch: 5 },  // Column for '#'
        { wch: 25 }, // Column for 'Name'
        { wch: 30 }, // Column for 'Mail ID'
        { wch: 20 }, // Column for 'Wallet Number'
        { wch: 15 }, // Column for 'Date Issued'
        { wch: 12 }, // Column for 'Balance'
        { wch: 20 }, // Column for 'Wallet Hash ID'
        { wch: 20 }, // Column for 'Partner Name'
        { wch: 20 }  // Column for 'User Hash ID'
      ];
      ws['!cols'] = wscols; // Apply the column widths

      // Download the Excel file
      XLSX.writeFile(wb, 'wallet.xlsx');
       this.isLoading = false;
    }, (error) => {
      console.error('Error fetching wallet data:', error);
       this.isLoading = false;
      // Handle error scenario here, maybe show a notification to the user
    });
}

//   exportToExcel(): void {
//   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredWallets.map((wallet, index) => ({
//     'S.No': this.getIndex(index),
//     Name: `${wallet.user.firstname} ${wallet.user.lastname}`,
//     "Mail ID": wallet.user.email,
//     "Wallet Number": wallet.wallet?.number || 'No wallet for user',
//     "Date Issued": wallet.wallet?.date?.issued || 'N/A',
//     Balance: wallet.wallet?.funds?.available?.amount || 'N/A',
//     "Wallet Hash ID": wallet.wallet?.id || 'N/A',
//     "Partner Name": wallet.companyname || 'N/A',
//     "User Hash ID": wallet.user.userHashedId || 'N/A'
//   })));

//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Wallet');

//   // Set column width for better readability
//   const wscols = [
//     { wch: 5 },  // Column for '#'
//     { wch: 25 }, // Column for 'Name'
//     { wch: 30 }, // Column for 'Mail ID'
//     { wch: 20 }, // Column for 'Wallet Number'
//     { wch: 15 }, // Column for 'Date Issued'
//     { wch: 12 }, // Column for 'Balance'
//     { wch: 20 }, // Column for 'Wallet Hash ID'
//     { wch: 20 }, // Column for 'Partner Name'
//     { wch: 20 }  // Column for 'User Hash ID'
//   ];
//   ws['!cols'] = wscols; // Apply the column widths

//   // Download the Excel file
//   XLSX.writeFile(wb, 'wallet.xlsx');
// }

 
//  exportToExcel(): void {
//   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredWallets.map((wallet, index) => ({
//     'S.No': this.getIndex(index),
//     Name: `${wallet.user.firstname} ${wallet.user.lastname}`,
//     "Mail ID": wallet.user.email,
//     "Wallet Number": wallet.wallet?.number || 'No wallet for user',
//     "Date Issued": wallet.wallet?.date?.issued || 'N/A',
//     Balance: wallet.wallet?.funds?.available?.amount || 'N/A',
//     "Wallet Hash ID": wallet.wallet?.id || 'N/A',
//     // "Partner Name": this.getCompanyName(wallet.user.partnercode) || 'N/A', // Ensure this fetches the right data
//     "Partner Name":wallet.companyname || 'N/A',
//     "User Hash ID": wallet.user.userHashedId || 'N/A'
//   })));

//   const wb: XLSX.WorkBook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Wallet');

//   // Set column width for better readability (adding space between columns)
//   const wscols = [
//     { wch: 5 },  // Column for '#'
//     { wch: 25 }, // Column for 'Name'
//     { wch: 30 }, // Column for 'Mail ID'
//     { wch: 20 }, // Column for 'Wallet Number'
//     { wch: 15 }, // Column for 'Date Issued'
//     { wch: 12 }, // Column for 'Balance'
//     { wch: 20 }, // Column for 'Wallet Hash ID'
//     { wch: 20 }, // Column for 'Partner Name'
//     { wch: 20 }  // Column for 'User Hash ID'
//   ];
//   ws['!cols'] = wscols; // Apply the column widths

//   // Download the Excel file
//   XLSX.writeFile(wb, 'wallet.xlsx');
// }

 
  // exportToExcel(): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredWallets.map((wallet, index) => ({
  //     '#': this.getIndex(index),
  //     Name: `${wallet.user.firstname} ${wallet.user.lastname}`,
  //     "Mail ID": wallet.user.email,
  //     "Wallet Number": wallet.wallet?.number || 'No wallet for user',
  //     "Date Issued": wallet.wallet?.date?.issued || 'N/A',
  //     Balance: wallet.wallet?.funds?.available?.amount || 'N/A',
  //     "Wallet Hash ID": wallet.wallet?.id || 'N/A',
  //     "Partner Name": this.getCompanyName(wallet.user.partnercode),
  //     "User Hash ID": wallet.user.userHashedId || 'N/A'
  //   })));
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Wallet');
  //   XLSX.writeFile(wb, 'wallet.xlsx');
  // }
 
  // Dummy function: Implement this based on your data or service.
  getCompanyName(partnercode: string): string {
    return ''; // Replace with actual lookup logic.
  }
 
  approveCard(category: any): void {
    console.log('Approved:', category);
  }
  rejectCard(category: any): void {
    console.log('Rejected:', category);
  }
  viewCategoryDetails(category: any): void {
    console.log('Viewing Details:', category);
  }
}