import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Admin } from '../services/admin';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-add-ipaddress',
  standalone: false,
  templateUrl: './add-ipaddress.html',
  styleUrl: './add-ipaddress.css'
})
export class AddIpaddress {
    panterCodes: any[] = [];
isLoading: boolean = false;
  dropdownOpen: boolean = false;
  ipAddresses: any[] = [];
   searchTerm: string = '';
   filteredIpAddresses: any[] = [];


  constructor(private router: Router, private adminService: Admin,    private toastr: ToastrService,
) {}

  ngOnInit(): void {
    this.loadIpAddresses();
  }

  loadIpAddresses(): void {
    this.isLoading = true;
   this.adminService.getAllIpAddresses().subscribe({
  next: (res) => {
    this.ipAddresses = res.reverse();
            this.isLoading = false;
  this.filteredIpAddresses = [...res];
  },

      error: (err) => {
        console.error('Failed to load IP addresses:', err);
        this.isLoading = false;
      }
    });
  }
  
  navigateToRoles() {
    this.router.navigate(['/getip']);
  }
  // fetchPanterCodes() {
  //   this.adminService.getPanterCode().subscribe({
  //     next: (data) => {
  //       this.panterCodes = data;
  //     },
  //     error: (err) => console.error('Failed to fetch panter codes:', err),
  //   });

dropdownOpenMap: { [id: string]: boolean } = {};

toggleDropdown(ipId: string) {
  this.dropdownOpenMap[ipId] = !this.dropdownOpenMap[ipId];
}

 editUser(id: string) {
  this.router.navigate(['/editip', id]);
}
deleteUser(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This mac address will be permanently deleted.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.adminService.deleteIpAddress(id).subscribe({
        next: () => {
          this.toastr.success('Mac address deleted successfully!');
          this.loadIpAddresses(); // refresh list
        },
        error: () => {
          this.toastr.error('Failed to delete Mac address');
        }
      });
    }
  });
}

onSearch(): void {
  const term = this.searchTerm.trim().toLowerCase();

  if (!term) {
    this.filteredIpAddresses = [...this.ipAddresses];
  } else {
    this.filteredIpAddresses = this.ipAddresses.filter(ip => {
      const mac = ip.mac_address.toLowerCase();
      const desc = (ip.description || '').toLowerCase();
      const status = ip.isActive ? 'active' : 'inactive';
      return [mac, desc, status].some(field => field.includes(term));
    });
  }
}


exportToExcel(): void {
  const data = this.filteredIpAddresses.map((ip, i) => ({
    No: i + 1,
    'MAC Address': ip.mac_address,
    Description: ip.description,
    Status: ip.isActive ? 'Active' : 'Inactive',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'IP_Addresses');
  XLSX.writeFile(wb, 'mac-addresses.xlsx');
}


 // update toggleStatus to persist to backend
  toggleStatus(ip: any) {
    const newStatus = !ip.isActive;
    this.adminService
      .updateIpAddress(ip._id, { isActive: newStatus })
      .subscribe({
        next: updated => {
          ip.isActive = updated.isActive;
          this.toastr.success('Status updated');
        },
        error: () => {
          this.toastr.error('Could not update status');
        }
      });
  }
}
