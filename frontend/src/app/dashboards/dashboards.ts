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
  status: 'Shipped' | 'Cancelled' | 'Under Process' | 'Pending';
  price: string;
  orderedDate: string;
}

interface Agent {
  id: string;
  name: string;
  balance: number;
  limit: number;
  debitBalance: number;
  status: 'Active' | 'Inactive';
  createdAt: string | Date;
  updatedAt: string | Date;
}

@Component({
  selector: 'app-dashboards',
  standalone: false,
  templateUrl: './dashboards.html',
  styleUrl: './dashboards.css'
})
export class Dashboards implements OnInit {

  loading: boolean = false;
  searchQuery: string = '';

  constructor(
    private dashboardService: Dashboard,
    private toastr: ToastrService,
    private adminService: Admin
  ) {}

  ngOnInit(): void {}

  // KPI snapshot
  kpis = {
    totalOrders: 45,
    totalPackage: 10,
    totalPayments: 60,
    subscriptions: 10,
    salesByUnit: { total: 12897, activeSales: 3274, progressPct: 50 },
    totalRevenue: 8889
  };

  // Charts data (two side-by-side)
  categories1 = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  series1: Series[] = [
    { name: 'Online',    color: '#0a2a43', data: [45, 55, 57, 56, 60, 58, 62, 59, 63] },
    { name: 'Offline',   color: '#00a7a7', data: [75, 85,100, 98, 88,105, 90,115, 92] },
    { name: 'Marketing', color: '#c4a968', data: [35, 40, 36, 27, 42, 45, 48, 50, 38] },
  ];

  categories2 = ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  series2: Series[] = [
    { name: 'North',  color: '#4f46e5', data: [30, 42, 39, 45, 50, 47, 52, 55, 58] },
    { name: 'South',  color: '#16a34a', data: [22, 28, 35, 33, 41, 46, 44, 49, 53] },
    { name: 'West',   color: '#f97316', data: [18, 25, 29, 31, 34, 38, 40, 42, 45] },
  ];

  private getMax(series: Series[]): number {
    return Math.max(...series.flatMap(s => s.data));
  }
  get max1(): number { return this.getMax(this.series1); }
  get max2(): number { return this.getMax(this.series2); }

  heightPct(v: number, max: number): string {
    const pct = (v / max) * 100;
    return pct.toFixed(2) + '%';
  }

  // Product sales table (dummy)
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

  // Agent Details (dummy)
  agents: Agent[] = [
    {
      id: 'AG-1001',
      name: 'Alice Johnson',
      balance: 1200,
      limit: 5000,
      debitBalance: 200,
      status: 'Active',
      createdAt: new Date('2025-08-01T10:23:00'),
      updatedAt: new Date('2025-08-20T12:05:00')
    },
    {
      id: 'AG-1002',
      name: 'Bob Smith',
      balance: 350,
      limit: 2000,
      debitBalance: 50,
      status: 'Inactive',
      createdAt: new Date('2025-07-12T09:00:00'),
      updatedAt: new Date('2025-08-18T08:30:00')
    },
    {
      id: 'AG-1003',
      name: 'Charlie Davis',
      balance: 780,
      limit: 3000,
      debitBalance: 120,
      status: 'Active',
      createdAt: new Date('2025-06-11T14:10:00'),
      updatedAt: new Date('2025-08-19T16:22:00')
    }
  ];

  // Transfer modal state
  showTransferModal = false;
  transferAgent: Agent | null = null;
  transferForm: { amount?: number; remark?: string } = {};

  // Agent actions (dummy)
  refreshAgents(): void {
    this.agents = [...this.agents];
    this.toastr.info('Refreshed', 'Agents');
  }

  toggleStatus(a: Agent, on: boolean) {
    a.status = on ? 'Active' : 'Inactive';
    a.updatedAt = new Date();
    this.toastr.info(`Status set to ${a.status}`, a.id);
  }

  openTransfer(a: Agent) {
    this.transferAgent = { ...a };
    this.transferForm = {};
    this.showTransferModal = true;
  }

  closeTransfer() {
    this.showTransferModal = false;
    this.transferAgent = null;
    this.transferForm = {};
  }

  submitTransfer() {
    if (!this.transferAgent) return;
    const amt = Number(this.transferForm.amount || 0);
    if (isNaN(amt) || amt <= 0) {
      this.toastr.error('Enter a valid amount', 'Transfer');
      return;
    }
    if (amt > this.transferAgent.balance) {
      this.toastr.warning('Amount exceeds current balance', 'Transfer');
      return;
    }
    const idx = this.agents.findIndex(x => x.id === this.transferAgent!.id);
    if (idx > -1) {
      this.agents[idx] = {
        ...this.agents[idx],
        balance: this.agents[idx].balance - amt,
        updatedAt: new Date()
      };
    }
    this.toastr.success('Transfer queued', this.transferAgent.id);
    this.closeTransfer();
  }

  downloadReports(a: Agent) {
    this.toastr.success('Report download started', a.id);
  }

  // (Existing sample handlers)
  onViewDetails(): void { console.log('View details clicked'); }
  openOrder(id: string): void { console.log('Open order', id); }
  onEdit(row: OrderRow): void { console.log('Edit', row); }
  onDelete(row: OrderRow): void { console.log('Delete', row); }

  open = { pages: false, Global: false };
  toggleMenu(menu: 'pages' | 'Global') { this.open[menu] = !this.open[menu]; }
  debug() { console.log('Debug clicked'); }
  // --- legacy edit modal shims (dummy) ---
showEditModal = false;
editingAgent: any = null;
editForm: any = {};

openEdit(a: any) {
  this.editingAgent = { ...a };
  this.editForm = {};
  this.showEditModal = true;
}

closeEdit() {
  this.showEditModal = false;
  this.editingAgent = null;
  this.editForm = {};
}

saveEdit() {
  this.toastr.info('Dummy save (no-op)', 'Edit Agent');
  this.closeEdit();
}
// ===== Pagination (icons only) =====
pageSize = 2;
currentPage = 1;

get totalPages(): number {
  return Math.max(1, Math.ceil(this.agents.length / this.pageSize));
}
get pagedAgents(): Agent[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.agents.slice(start, start + this.pageSize);
}
get rangeFrom(): number {
  return this.agents.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
}
get rangeTo(): number {
  return Math.min(this.currentPage * this.pageSize, this.agents.length);
}

firstPage() { this.currentPage = 1; }
prevPage()  { if (this.currentPage > 1) this.currentPage--; }
nextPage()  { if (this.currentPage < this.totalPages) this.currentPage++; }
lastPage()  { this.currentPage = this.totalPages; }
private clampPage() {
  if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  if (this.currentPage < 1) this.currentPage = 1;
}


}

