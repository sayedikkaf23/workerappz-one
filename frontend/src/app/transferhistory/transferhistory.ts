import { Component, OnInit } from '@angular/core';
import { Admin } from '../services/admin';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-transferhistory',
  standalone: false,
  templateUrl: './transferhistory.html',
  styleUrl: './transferhistory.css'
})
export class Transferhistory {
  limit: number = 1000;
  currentPage: number = 1;
  partnerCode: any;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  total: number = 0;
  page: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  isLoading: boolean = false;
  errorMsg: string = '';
  emailFilter: string = '';
  searchTerm: string = '';
  paginatedTransactions: any[] = [];
  fromDate: string = '';
  toDate: string = '';

  constructor(private adminService: Admin) {}

  ngOnInit() {
    const adminRole = localStorage.getItem('AdminRole');
    const partnerCode = localStorage.getItem('partnerCode');

    // if (!adminRole || adminRole === 'superadmin' || adminRole === 'administrator') {
    //   this.fetchTransactionHistory();
    // } else {
    //   this.fetchTransactionHistoryByPartnerCode(partnerCode);
    // }
  }

  fetchTransactionHistory(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.adminService.getTransactionHistory(this.emailFilter, this.page, this.limit).subscribe({
      next: (res:any) => {
        this.transactions = res.data || [];
        // Sort transactions so the most recent come first
        this.transactions.sort((a, b) => {
          return this.getTransactionDate(b).getTime() - this.getTransactionDate(a).getTime();
        });
        this.filteredTransactions = [...this.transactions];
        this.total = res.total || 0;
        this.page = res.page || 1;
        this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        this.isLoading = false;
        this.paginateTransactions();
      },
      error: (err:any) => {
        this.isLoading = false;
        this.errorMsg = 'Error fetching transaction history.';
        console.error('Transaction history error:', err);
      }
    });
  }

  fetchTransactionHistoryByPartnerCode(partnerCode: any): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.adminService.fetchTransactionHistoryByPartnerCode(partnerCode, this.emailFilter, this.page, this.limit).subscribe({
      next: (res:any) => {
        this.transactions = res.data || [];
        // Sort transactions so the most recent come first
        this.transactions.sort((a, b) => {
          return this.getTransactionDate(b).getTime() - this.getTransactionDate(a).getTime();
        });
        this.filteredTransactions = [...this.transactions];
        this.total = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        this.page = res.page || 1;
        this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        this.paginateTransactions();
        this.isLoading = false;
      },
      error: (err:any) => {
        this.isLoading = false;
        this.errorMsg = 'Error fetching transaction history.';
        console.error('Transaction history error:', err);
      }
    });
  }

  getTransactionDate(transaction: any): Date {
    if (transaction.fullTransactionData?.date?.created) {
      return new Date(transaction.fullTransactionData.date.created);
    } else if (transaction.createdAt) {
      return new Date(transaction.createdAt);
    }
    return new Date(0);
  }

  paginateTransactions(): void {
    if (this.filteredTransactions) {
      const startIndex = (this.page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.paginateTransactions();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.paginateTransactions();
    }
  }

 // transfer-history.component.ts
onSearch(): void {
  const term = this.searchTerm.trim().toLowerCase();
  if (!term) {
    this.filteredTransactions = [...this.transactions];
  } else {
    this.filteredTransactions = this.transactions.filter(tx =>
      JSON.stringify(tx).toLowerCase().includes(term)
    );
  }

  // reset pagination
  this.page = 1;
  this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  this.paginateTransactions();
}


  applyDateFilter(): void {
    if (!this.fromDate && !this.toDate) {
      this.filteredTransactions = [...this.transactions];
    } else {
      this.filteredTransactions = this.transactions.filter(transaction => {
        const tDate = this.getTransactionDate(transaction);
        let valid = true;
        if (this.fromDate) {
          valid = valid && (tDate >= new Date(this.fromDate));
        }
        if (this.toDate) {
          // Set toDate to end of day to include transactions throughout the selected day
          const toDateEnd = new Date(this.toDate);
          toDateEnd.setHours(23, 59, 59, 999);
          valid = valid && (tDate <= toDateEnd);
        }
        return valid;
      });
    }
  
    // Sort filtered transactions (most recent first)
    this.filteredTransactions.sort((a, b) => {
      return this.getTransactionDate(b).getTime() - this.getTransactionDate(a).getTime();
    });
  
    // Reset pagination
    this.page = 1;
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    this.paginateTransactions();
  }
  
  // exportToExcel(): void {
  //   const data = this.filteredTransactions.map((transaction, index) => ({
  //     No: index + 1,
  //     "Sender Name": transaction.fullTransactionData?.sender?.email || transaction.from || 'N/A',
      
  //     // Sender Amount will be shown as negative in Excel
  //     "Sender Amount": transaction.sender_amount ? `- ${transaction.sender_amount}` : 'N/A',
      
  //     "Receiver Name": transaction.fullTransactionData?.recipient?.email || transaction.to || 'N/A',
  //     "Receiver Amount": transaction.receiver_amount || 'N/A',
  //     "Purchase Fee": transaction.purchase_fee || 'N/A',
  //     "Amount Transferred": transaction.fullTransactionData?.amount || transaction.amount || 'N/A',
  //     "Date of Transfer": transaction.fullTransactionData?.date?.created || transaction.createdAt,
  //     "Virtual Card Fee": transaction.vr_card_fee || 'N/A',
  //     "Physical Card Fee": transaction.py_card_fee || 'N/A',
  //     "Load Balance Fee": transaction.load_balance_fee || 'N/A',
  //     "Master Load Balance Fee": transaction.master_load_balance|| 'N/A',
  //     "Transfer Fee": transaction.transfer_fee || 'N/A',
      
  //     // If company name is empty, show 'NA'
  //     "Partner Name": transaction.companyname !== "" ? transaction.companyname : "NA",
      
  //     // Transaction ID
  //     "Transaction ID": transaction.transactionId || 'N/A'
  //   }));
  
  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  //   XLSX.writeFile(workbook, 'Transactions.xlsx');
  // }
  exportToExcel(): void {
  // 1) sort for export
  const sorted = [...this.filteredTransactions].sort(
    (a, b) => this.getTransactionDate(b).getTime()
              - this.getTransactionDate(a).getTime()
  );

  // 2) map into flat rows
  const data = sorted.map((tx, i) => ({
    No:                 i + 1,
    'Sender Name':      tx.fullTransactionData?.sender?.email  || tx.from  || 'N/A',
    'Sender Amount':   tx.sender_amount
                         ? `- ${tx.sender_amount}` 
                         : 'N/A',
    'Receiver Name':    tx.fullTransactionData?.recipient?.email || tx.to    || 'N/A',
    'Receiver Amount':  tx.receiver_amount  || 'N/A',
    'Amount Transferred': tx.fullTransactionData?.amount || tx.amount || 'N/A',
    'Date of Transfer':  tx.fullTransactionData?.date?.created || tx.createdAt,
    'Purchase Declined Fee':   tx.transaction_declined_fee || 'N/A',
    'Virtual Card Fee':        tx.vr_card_fee          || 'N/A',
    'Physical Card Fee':       tx.py_card_fee          || 'N/A',
    'Load Balance Fee':        tx.load_balance_fee     || 'N/A',
    'Master Load Balance Fee': tx.master_load_balance  || 'N/A',
    'Transfer Fee':            tx.transfer_fee         || 'N/A',
    'Partner Name':            tx.companyname !== ''  ? tx.companyname : 'NA',
    'Transaction ID':          tx.transactionId       || 'N/A'
  }));

  // 3) build sheet
  const ws = XLSX.utils.json_to_sheet(data, {
    header: Object.keys(data[0])
  });

  // 4) kick up column widths
  ws['!cols'] = [
    { wch: 5  }, // No.
    { wch: 25 }, // Sender Name
    { wch: 15 }, // Sender Amount
    { wch: 25 }, // Receiver Name
    { wch: 15 }, // Receiver Amount
    { wch: 20 }, // Amount Transferred
    { wch: 20 }, // Date of Transfer
    { wch: 20 }, // Purchase Declined Fee
    { wch: 15 }, // Virtual Card Fee
    { wch: 15 }, // Physical Card Fee
    { wch: 15 }, // Load Balance Fee
    { wch: 20 }, // Master Load Balance Fee
    { wch: 15 }, // Transfer Fee
    { wch: 25 }, // Partner Name
    { wch: 25 }  // Transaction ID
  ];

  // 5) export
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  XLSX.writeFile(wb, 'Transactions.xlsx');
}

  
  getCompanyName(partnercode: string): string {
    return this.partnerCode && this.partnerCode[partnercode] ? this.partnerCode[partnercode] : "NA";
  }

  fetchPanterCodes(): void {
    this.adminService.getPanterCode().subscribe({
      next: (data:any) => {
        this.partnerCode = data.reduce((acc: any, item: any) => {
          acc[item.partnerCode] = item.companyname;
          return acc;
        }, {});
      },
      error: (err:any) => console.error('Failed to fetch partner codes:', err)
    });
  }
}
