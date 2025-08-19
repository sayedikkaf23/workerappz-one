import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from '../services/dashboard';
import { Admin } from '../services/admin';


@Component({
  selector: 'app-dashboards',
  standalone: false,
  templateUrl: './dashboards.html',
  styleUrl: './dashboards.css'
})
export class Dashboards implements OnInit {
  vr_card_total: number = 0; // Default value
  purchase_bal: number = 0; // Default value
  py_card_total: number = 0; // Default v
  loading: boolean = false;
  totalIndividualUsers: number = 0;
  totalBusinessUsers: number = 0;
  totalCards: number = 567; // Placeholder value
  maxUsers: number = 1000; // Example maximum value for calculation
  maxCards: number = 1000; // Example maximum value for calculation
  creditPrefundCredit: any = null;
  creditPrefundBalance: any = null;
  credit: any;
  partnercode: any;
  totalAmount: any;
  adminId: string ='';
  totalWallet: number = 0;
  totalMaster: number = 0;
  masterDetails: any[] = [];
  rowsPerPage: number = 10;
  searchQuery: string = '';
  // rowsPerPage: number = 10;
  currentPage: number = 1;

  constructor(
    private dashboardService: Dashboard,
    private toastr: ToastrService,
    private adminService: Admin
  ) {}


  ngOnInit(): void {
    const adminRole = localStorage.getItem('AdminRole');
    this.partnercode = localStorage.getItem('partnerCode');
    // this.adminId = localStorage.getItem('AdminID');

    // if (adminRole === 'Master') {
    //   // Call another API if role is Master
    //   this.fetchUserCountsPartnercode(this.partnercode);
    //   this.fetchAdditionalMasterData(this.partnercode); // This is the additional method to call for Master role
    // } else if (adminRole === 'administrator') {
    //   this.partnercode = 'superadmin';
    //   this.fetchUserCountsPartnercode(this.partnercode);
    //   this.fetchAdditionalMasterData(this.partnercode);
    // } else {
    //   // Call these methods for roles other than Master
    //   this.fetchCreditPrefundData();
    //   this.fetchDebitPrefundData();
    //   this.fetchUserCounts(this.partnercode);
    // }
    // this.loadPermissions(); // Call the function to load permissions on initialization
  }

  open = {
  pages: false,
  Global: false
};

toggleMenu(menu: 'pages' | 'Global') {
  this.open[menu] = !this.open[menu];
}

debug() {
  console.log('Debug clicked');
}


  fetchUserCounts(partnercode: any): void {
    this.dashboardService
      .getAllIndividualAndBusinessUsers(partnercode)
      .subscribe(
        (response) => {
          this.totalIndividualUsers = response.individualUserCount || 0;
          this.totalBusinessUsers = response.businessUserCount || 0;
          this.vr_card_total = response.vr_card_total;
          this.py_card_total = response.py_card_total;
          // You can also set `this.totalCards` if needed
          // ← add these:
          this.totalWallet = response.totalWallet || 0;
          this.totalMaster = response.totalMaster || 0;
          this.masterDetails = response.masterDetails || [];
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Error fetching user counts', 'Error');
          console.error('Error fetching user counts:', error);
          this.loading = false;
        }
      );
  }
  fetchUserCountsPartnercode(partnerCode: any): void {
    this.dashboardService.fetchUserCountsPartnercode(partnerCode).subscribe(
      (response) => {
        this.totalIndividualUsers = response.individualUserCount || 0;
        this.totalBusinessUsers = response.businessUserCount || 0;
        // You can also set `this.totalCards` if needed

        this.loading = false;
      },
      (error) => {
        this.toastr.error('Error fetching user counts', 'Error');
        console.error('Error fetching user counts:', error);
        this.loading = false;
      }
    );
  }

  getProgressBarWidth(value: number, max: number): string {
    const percentage = (value / max) * 100;
    return `${percentage}%`;
  }

  fetchCreditPrefundData(): void {
    // Call the first endpoint for Credit Prefund Credit
    this.dashboardService.getCreditPrefundCredit().subscribe(
      (response) => {
        this.creditPrefundCredit = response;
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Error fetching Credit Prefund Credit', 'Error');
        console.error('Error fetching Credit Prefund Credit:', error);
        this.loading = false;
      }
    );
  }
  fetchDebitPrefundData(): void {
    // Call the first endpoint for Credit Prefund Credit
    this.dashboardService.getCreditPrefundBalance().subscribe(
      (response) => {
        this.creditPrefundBalance = response;
        this.loading = false;
      },
      (error) => {
        this.toastr.error('Error fetching Credit Prefund Credit', 'Error');
        console.error('Error fetching Credit Prefund Credit:', error);
        this.loading = false;
      }
    );
  }

  fetchAdditionalMasterData(partnerCode: string): void {
    this.dashboardService
      .getAdditionalMasterData(partnerCode, this.adminId)
      .subscribe(
        (response) => {
          const financialDetails = response.financialDetails;
          // this.creditPrefundBalance = financialDetails.debit;
          console.log(financialDetails);
          this.credit = financialDetails.totalAmount;
          this.totalAmount = financialDetails.debit;

          console.log(
            this.credit,
            this.totalAmount,
            ' this.creditPrefundBalance'
          );
          this.loading = false;
        },
        (error) => {
          this.toastr.error('Error fetching financial details', 'Error');
          console.error('Error fetching financial details:', error);
          this.loading = false;
        }
      );
  }
  loadPermissions(): void {
    const adminId = localStorage.getItem('AdminID');
    if (adminId) {
      this.adminService.Premisson(adminId).subscribe(
        (response) => {
          if (
            response &&
            response.vr_card_total !== undefined &&
            response.py_card_total !== undefined
          ) {
            if (this.partnercode === 'superadmin') {
              console.log('superadmin');

              this.vr_card_total = response.totalUserCardCount;
              this.py_card_total = response.totalPyCardCount;
              this.purchase_bal = response.totalPurchase;
            } else {
              this.vr_card_total = response.vr_card_total;
              this.py_card_total = response.py_card_total;
              this.purchase_bal = response.totalPurchase;
            }

            const adminRole = localStorage.getItem('AdminRole');
            if (
              this.partnercode?.toLowerCase() === 'superadmin' &&
              adminRole?.toLowerCase() === 'administrator'
            ) {
              this.credit = response.totalAmount;
              this.totalAmount = response.debit;
            }
          }
        },
        (error) => {
          console.error('Error loading admin permissions', error);
        }
      );
    } else {
      console.error('No AdminID found in localStorage');
    }
  }

  get filteredMasterDetails() {
    return this.masterDetails.filter(
      (master: any) =>
        master.partnerName
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
        (master.totalAmount &&
          master.totalAmount
            .toString()
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()))
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredMasterDetails.length / this.rowsPerPage);
  }

  get filteredAndPagedMasterDetails() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = this.currentPage * this.rowsPerPage;
    return this.filteredMasterDetails.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
