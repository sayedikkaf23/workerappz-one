import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from '../services/dashboard';
import { Admin } from '../services/admin';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke,
  ApexPlotOptions, ApexLegend, ApexGrid, ApexYAxis, ApexFill
} from 'ng-apexcharts';


type Series = { name: string; color: string; data: number[] };

interface OrderRow {
  orderNo: string;
  productName: string;
  productImg: string;
  rating: number;
  ratingCount: number;
  customer: string;
  quantity: number;
  status:
    | 'Shipped'
    | 'Cancelled'
    | 'Under Process'
    | 'Pending';
  price: string;
  orderedDate: string;
}

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

   // KPI snapshot (you can bind these)
  kpis = {
    totalOrders: 45,
    totalPackage: 10,
    totalPayments: 60,
    subscriptions: 10,
    salesByUnit: { total: 12897, activeSales: 3274, progressPct: 50 },
    totalRevenue: 8889
  };

  // CSS-only bar chart data
  categories = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  series: Series[] = [
    { name: 'Online',    color: '#0a2a43', data: [45, 55, 57, 56, 60, 58, 62, 59, 63] },
    { name: 'Offline',   color: '#00a7a7', data: [75, 85,100, 98, 88,105, 90,115, 92] },
    { name: 'Marketing', color: '#c4a968', data: [35, 40, 36, 27, 42, 45, 48, 50, 38] },
  ];
  private get maxValue(): number {
    return Math.max(...this.series.flatMap(s => s.data));
  }
  heightPct(v: number): string {
    const pct = (v / this.maxValue) * 100;
    return pct.toFixed(2) + '%';
  }

  // Product sales table
  rows: OrderRow[] = [
    {
      orderNo: '1537890',
      productName: 'A semi minimal chair',
      productImg: 'assets/images/shop/1.png',
      rating: 5.0,
      ratingCount: 90,
      customer: 'Simon Cowall',
      quantity: 1,
      status: 'Shipped',
      price: '$4320.29',
      orderedDate: '25 Mar 2022'
    },
    {
      orderNo: '1539078',
      productName: 'Two type of watch sets',
      productImg: 'assets/images/shop/2.png',
      rating: 3.0,
      ratingCount: 50,
      customer: 'Meisha Kerr',
      quantity: 2,
      status: 'Cancelled',
      price: '$6745.99',
      orderedDate: '25 Mar 2022'
    },
    {
      orderNo: '1539832',
      productName: 'Mony layer headphones',
      productImg: 'assets/images/shop/4.png',
      rating: 4.5,
      ratingCount: 65,
      customer: 'Jessica',
      quantity: 1,
      status: 'Under Process',
      price: '$1176.89',
      orderedDate: '27 Feb 2022'
    },
    {
      orderNo: '1538267',
      productName: 'Sportive coloured shoes',
      productImg: 'assets/images/shop/3.png',
      rating: 2.5,
      ratingCount: 15,
      customer: 'Jason Stathman',
      quantity: 1,
      status: 'Pending',
      price: '$1867.29',
      orderedDate: '2 Apr 2022'
    },
    {
      orderNo: '1537890B',
      productName: 'Vayon black shades',
      productImg: 'assets/images/shop/7.png',
      rating: 3.5,
      ratingCount: 36,
      customer: 'Khabib Hussain',
      quantity: 1,
      status: 'Shipped',
      price: '$2439.99',
      orderedDate: '8 Apr 2022'
    }
  ];

  // Action handlers
  onViewDetails(): void {
    // open modal / navigate
    console.log('View details clicked');
  }
  openOrder(id: string): void {
    console.log('Open order', id);
  }
  onEdit(row: OrderRow): void {
    console.log('Edit', row);
  }
  onDelete(row: OrderRow): void {
    console.log('Delete', row);
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
