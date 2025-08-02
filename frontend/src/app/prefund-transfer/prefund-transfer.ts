import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Admin } from '../services/admin';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-prefund-transfer',
  standalone: false,
  templateUrl: './prefund-transfer.html',
  styleUrl: './prefund-transfer.css'
})
export class PrefundTransfer implements OnInit {
  searchTerm: string = '';

  isLoading: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // New properties for date filter
  fromDate: string = '';
  toDate: string = '';


 // matches the default limit in your service
  totalUsers: number = 0;   // to display how many total users were found
  hasNextPage: boolean = false;

  // For storing and displaying transactions
  transactions: any[] = [];
  filteredTransactions: any[] = []; // optional: if you add a search filter
          // only if you're doing client-side pagination of transactions

    
   errorMessage: string = '';

  constructor(private adminService: Admin) {}

  ngOnInit() {
    const adminRole = localStorage.getItem('AdminRole');
    const partnerCode = localStorage.getItem('partnerCode');

    if (!adminRole || adminRole === 'superadmin' || adminRole === 'administrator') {
      this.fetchTransactions();
    } else {
      this.fetchTransactions(partnerCode); // Load transactions for specific partner
    }
  }

  fetchTransactions(partnerCode?: any) {
    this.isLoading = true;
    this.errorMessage = '';
  
    this.adminService.getAllUsersTransactionsHistory(partnerCode, this.currentPage, this.itemsPerPage).subscribe({
      next: async (response) => {
        console.log("response: ", response);
        if (!response || !response.userDetails) {
          this.transactions = [];
          this.filteredTransactions = [];
          this.isLoading = false;
          return;
        }
  
        this.totalUsers = response.totalUsers || 0;
        this.hasNextPage = response.hasNextPage || false;
  
  //  Flatten + fetch company names
  const transactionPromises = response.userDetails.map(async (curr: any) => {
    let companyName = 'NA';
    try {
      if (curr.user.partnercode) {
        const res = await this.adminService.getCompanyNameByPartnerCode(curr.user.partnercode).toPromise();
        companyName = res.companyname || 'NA';
      }
    } catch (error) {
      console.warn(`Failed to fetch company name for ${curr.user.partnercode}`);
    }

    const txs = curr.transactions.map((transaction: any) => ({
      ...transaction,
      userEmail: curr.user.email,
      companyName: companyName
    }));

    return txs;
  });

  const transactionArrays = await Promise.all(transactionPromises);
  this.transactions = transactionArrays.flat();
  
        // Sort transactions by date descending
        this.transactions.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
  
        // Apply filtered transactions
        this.filteredTransactions = this.transactions;
        console.log("ftransaction :", this.filteredTransactions );
  
        // Set total pages based on filtered data
        this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
        this.errorMessage = 'Failed to fetch transactions.';
        this.isLoading = false;
      }
    });
  }
  
  
  
  /**
   * Returns only the transactions for the current page if you are paginating on the client side.
   */
  get paginatedTransactions() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, startIndex + this.itemsPerPage);
  }


  
  

  /**
   * Filters transactions based on the search term.
   */
  // onSearch() {
  //   // Trim any extra spaces
  //   const query = (this.searchTerm || '').trim().toLowerCase();
    
  //   // If empty, reset
  //   if (!query) {
  //     this.filteredTransactions = this.transactions;
  //     this.currentPage = 1;
  //     this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  //     return;
  //   }
  
  //   // Filter on fields that actually exist in the transaction object
  //   this.filteredTransactions = this.transactions.filter(tx => {
  //     const userEmail = tx.userEmail?.toLowerCase() || '';
  //     const merchantName = tx.details?.merchant_name?.toLowerCase() || '';
  //     const amountStr = tx.amount?.toString() || '';
  //     const typeStr = tx.type?.toLowerCase() || '';
  //     const dateStr = tx.date ? new Date(tx.date).toLocaleDateString() : ''; // Convert date to string format
      
  //     // Return true if any field matches the query
  //     return (
  //       userEmail.includes(query) ||
  //       merchantName.includes(query) ||
  //       amountStr.includes(query) ||
  //       typeStr.includes(query) ||
  //       dateStr.includes(query) // Include date field in search
  //     );
  //   });
  
  //   // Reset pagination
  //   this.currentPage = 1;
  //   this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  // }
  
  onSearch() {
  const q = (this.searchTerm || '').trim().toLowerCase();

  if (!q) {
    // no filter
    this.filteredTransactions = [...this.transactions];
  } else {
    this.filteredTransactions = this.transactions.filter(tx =>
      JSON.stringify(tx).toLowerCase().includes(q)
    );
  }

  // reset pagination
  this.currentPage = 1;
  this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
}
  

  /**
   * New method: Filters transactions based on the date range.
   * It uses the 'date' field from each transaction.
   * Also sorts the results so that the most recent transactions appear first.
   */
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    // Because you already have all transactions, no need to re-fetch from server
    // Just re-calc the paginatedTransactions slice
  }
  
  
  
  /**
   * Example of local search filter for the flattened transactions
   */
  applyDateFilter() {
    let temp = this.transactions;
  
    // If fromDate is set, filter transactions from that date
    if (this.fromDate) {
      const from = new Date(this.fromDate).setHours(0, 0, 0, 0); // Set to the start of the day
      temp = temp.filter(tx => {
        const txDate = new Date(tx.date).getTime();
        return txDate >= from;
      });
    }
  
    // If toDate is set, filter transactions up to that date
    if (this.toDate) {
      const to = new Date(this.toDate).setHours(23, 59, 59, 999); // Set to the end of the day
      temp = temp.filter(tx => {
        const txDate = new Date(tx.date).getTime();
        return txDate <= to;
      });
    }
  
    // Update the filtered transactions after applying the date filters
    this.filteredTransactions = temp;
    this.currentPage = 1; // Reset to page 1 after filtering
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage); // Recalculate total pages
  }
  
  
  
  /**
   * Exports the filtered transactions to an Excel file.
   */
  exportToExcel() {
    const tableData = this.filteredTransactions.map((transaction, index) => ({
      No: index + 1,
      Email: transaction.userEmail,
      "Merchant Name": transaction.details?.merchant_name,
      Amount: transaction.amount,
      Balance: transaction.balance,
      Type: transaction.type,
      Status: transaction.status,
      "Date": transaction.date ? new Date(transaction.date).toLocaleString() : '', // Ensure date is formatted
      "Transaction Currency": transaction.details?.transaction_currency,
      "Total Transaction Amount": transaction.details?.total_transaction_amount,
      "Transaction Network": transaction.details?.transaction_network,
      "Partner Name": transaction.companyName || 'NA'

    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);
    const workbook: XLSX.WorkBook = { Sheets: { 'PrefundTransactions': worksheet }, SheetNames: ['PrefundTransactions'] };
    XLSX.writeFile(workbook, `PrefundTransactions_${new Date().getTime()}.xlsx`);
  }
  
}
