import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from '../services/dashboard';
import { Admin } from '../services/admin';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke,
  ApexPlotOptions, ApexLegend, ApexGrid, ApexYAxis, ApexFill
} from 'ng-apexcharts';
import * as XLSX from 'xlsx';


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
  createdAt: Date;
  updatedAt: Date;
  downloadReports?: boolean; // ← add this
}

@Component({
  selector: 'app-dashboards',
  standalone: false,
  templateUrl: './dashboards.html',
  styleUrl: './dashboards.css'
})
export class Dashboards implements OnInit {
  searchQuery: string = '';


  constructor(
    private dashboardService: Dashboard,
    private toastr: ToastrService,
    private adminService: Admin
  ) {}

  ngOnInit(): void {
        this.fetchAgents();

  }

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
  const previous = a.status;
  a.status = on ? 'Active' : 'Inactive';

  const payload: any = {
    agentId: Number(a.id),
    agent_Type: 'PayIN',   // 🔴 mandatory field
    isActive: on
  };

  this.adminService.updateAgent(payload).subscribe({
    next: (r) => {
      if (r?.resCode === 200 && r?.resData === true) {
        this.toastr.success(r?.resMessage || 'Update Success!', `Agent ${a.id}`);
      } else {
        a.status = previous; // rollback
        this.toastr.warning(r?.resMessage || 'Update failed', `Agent ${a.id}`);
      }
    },
    error: () => {
      a.status = previous; // rollback
      this.toastr.error('Failed to update agent', `Agent ${a.id}`);
    },
  });
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

  toggleDownloadReports(a: Agent, to: boolean) {
  const prev = !!a.downloadReports;
  a.downloadReports = to; // optimistic UI

  const payload = {
    agentId: Number(a.id),
    agent_Type: 'PayIN',          // mandatory
    Download_Reports: to          // backend expects this exact key
  };

  this.adminService.updateAgent(payload).subscribe({
    next: (r) => {
      if (r?.resCode === 200 && r?.resData === true) {
        this.toastr.success(r?.resMessage || 'Updated Download_Reports', `Agent ${a.id}`);
      } else {
        a.downloadReports = prev; // rollback
        this.toastr.warning(r?.resMessage || 'Update failed', `Agent ${a.id}`);
      }
    },
    error: () => {
      a.downloadReports = prev;   // rollback
      this.toastr.error('Failed to update Download_Reports', `Agent ${a.id}`);
    }
  });
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
  if (!this.editingAgent) return;

  const payload: any = {
    agentId: Number(this.editingAgent.id),
    agent_Type: 'PayIN',   // 🔴 mandatory field
    isActive: this.editingAgent.status === 'Active',
    // add other fields from form if needed
    // agent_Name: this.editForm.agent_Name,
    // email: this.editForm.email,
    // ...
  };

  this.adminService.updateAgent(payload).subscribe({
    next: (r) => {
      if (r?.resCode === 200 && r?.resData) {
        this.toastr.success(r?.resMessage || 'Update Success!', `Agent ${payload.agentId}`);
        this.closeEdit();
        this.fetchAgents();
      } else {
        this.toastr.warning(r?.resMessage || 'Update failed', `Agent ${payload.agentId}`);
      }
    },
    error: () => this.toastr.error('Failed to update agent', 'Error'),
  });
}






// Filtered view of agents based on searchQuery
get filteredAgents(): Agent[] {
  const q = (this.searchQuery || '').trim().toLowerCase();
  if (!q) return this.agents;
  return this.agents.filter(a => {
    const hay = [
      a.id,
      a.name,
      a.status,
      a.balance,
      a.limit,
      a.debitBalance,
      a.createdAt,
      a.updatedAt,
    ].map(v => ('' + v).toLowerCase());
    return hay.some(v => v.includes(q));
  });
}

// Re-clamp when filter changes
onSearchChange(): void {
  this.currentPage = 1;
  this.clampPage();
}



get totalPages(): number {
  return Math.max(1, Math.ceil(this.filteredAgents.length / this.pageSize));
}
get pagedAgents(): Agent[] {
  const start = (this.currentPage - 1) * this.pageSize;
  return this.filteredAgents.slice(start, start + this.pageSize);
}
get rangeFrom(): number {
  return this.filteredAgents.length ? (this.currentPage - 1) * this.pageSize + 1 : 0;
}
get rangeTo(): number {
  return Math.min(this.currentPage * this.pageSize, this.filteredAgents.length);
}

private clampPage() {
  if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
  if (this.currentPage < 1) this.currentPage = 1;
}
totalAgents = 0;         // from API: res.resData.total
currentPage = 1;
pageSize = 10;
agents: Agent[] = [];
loading = false;

fetchAgents(): void {
  this.loading = true;
this.adminService.getAgentList(this.currentPage, this.pageSize).subscribe({
  next: (res) => {
    // If the proxy had to wrap raw text, res.raw would exist — defensive check:
    const dataRoot = res?.resData?.data || res?.raw?.resData?.data || [];
    this.agents = dataRoot.map((a: any) => ({
      id: a.agent_ID,
      name: a.agent_Name,
      balance: a.balanceCreditLimitInUSD,
      limit: a.creditLimitInUSD,
      debitBalance: a.agent_Debit_Balance,
      status: a.status ? 'Active' : 'Inactive',
      createdAt: new Date(a.createdOn),
      updatedAt: new Date(a.updatedOn),
    }));
    this.totalAgents = Number(res?.resData?.total ?? this.agents.length);
  },
  error: () => this.toastr.error('Failed to load agents', 'Error'),
});

}

// hook your pager to server-side pages
firstPage(){ this.currentPage = 1; this.fetchAgents(); }
prevPage(){ if (this.currentPage > 1){ this.currentPage--; this.fetchAgents(); } }
nextPage(){ this.currentPage++; this.fetchAgents(); }
lastPage(){ 
  // if API doesn’t return total pages, you can’t jump to last reliably.
  // Option 1: keep a `totalPages` from backend. If you have it:
  // this.currentPage = this.totalPages; this.fetchAgents();
}

private agentToRow(a: Agent) {
  return {
    'Agent Id': a.id,
    'Agent Name': a.name,
    'Balance (USD)': a.balance,
    'Limit (USD)': a.limit,
    'Debit Balance (USD)': a.debitBalance,
    'Status': a.status,
    'Created At': this.formatDateForExcel(a.createdAt),
    'Updated At': this.formatDateForExcel(a.updatedAt)
  };
}

private formatDateForExcel(d: Date | string): string {
  if (!d) return '';
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().replace('T', ' ').slice(0, 19);
}

exportAgentToExcel(a: Agent): void {
  try {
    const row = this.agentToRow(a);
    const ws = XLSX.utils.json_to_sheet([row]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agent Report');

    const filename = `Agent_${a.id}_${this.timestamp()}.xlsx`;
    XLSX.writeFile(wb, filename);
    this.toastr.success('Excel generated', filename);
  } catch {
    this.toastr.error('Failed to generate Excel', 'Download Report');
  }
}

private timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
exportAllAgentsToExcel(): void {
  try {
    const rows = this.agents.map(a => this.agentToRow(a));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agents Report');

    const filename = `Agents_Report_${this.timestamp()}.xlsx`;
    XLSX.writeFile(wb, filename);
    this.toastr.success('Excel generated', filename);
  } catch {
    this.toastr.error('Failed to generate Excel', 'Download Report');
  }
}

deleteAgent(a: Agent) {
  if (!confirm(`Are you sure you want to delete Agent ${a.id}?`)) return;
alert('Delete not implemented in this demo.');
  // this.adminService.deleteAgent(a.id).subscribe({
  //   next: (r) => {
  //     if (r?.resCode === 200) {
  //       this.toastr.success('Agent deleted', `Agent ${a.id}`);
  //       this.fetchAgents();
  //     } else {
  //       this.toastr.warning(r?.resMessage || 'Delete failed', `Agent ${a.id}`);
  //     }
  //   },
  //   error: () => this.toastr.error('Failed to delete agent', 'Error'),
  // });
}

}
