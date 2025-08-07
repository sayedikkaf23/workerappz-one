import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../services/admin'; // Import the service
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit {
  // roles = [];
  roles: any[] = [];
  filteredRoles: any[] = [];
  searchTerm: string = '';
  // Other properties

  constructor(private router: Router, private adminService: Admin) {}

  ngOnInit(): void {
    // this.fetchAllClients();
  }

  // Method to fetch clients
  fetchAllClients() {
    this.adminService.getAllClients().subscribe(
      (clients:any) => {
        this.roles = clients.reverse();
        this.filteredRoles = [...clients];
      },
      (error:any) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();

    // if the box is empty, restore all rows
    if (!term) {
      this.filteredRoles = [...this.roles];
      return;
    }

    // otherwise filter as before
    this.filteredRoles = this.roles.filter(
      (u) =>
        u.email?.toLowerCase().includes(term) ||
        u.partnerCode?.toLowerCase().includes(term) ||
        u.role?.role_name?.toLowerCase().includes(term)
    );
  }

  exportToExcel(): void {
    const data = this.filteredRoles.map((u, i) => ({
      No: i + 1,
      Email: u.email,
      'Role Name': u.role?.role_name || 'N/A',
      'Partner Code': u.partnerCode || 'N/A',
      'Updated On': new Date(u.updatedAt).toLocaleString(),
      'Wallet Balance': u.totalAmount,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  }

  navigateToRoles() {
    this.router.navigate(['/userrole']);
  }

  toggleStatus(role:any) {
    role.isActive = !role.isActive;
  }

  toggleDropdown(role: any) {
    this.roles.forEach((r) => (r.showDropdown = false));
    role.showDropdown = !role.showDropdown;
  }

  editUser(role: any) {
    console.log('Edit user:', role);
    this.router.navigate(['/admin/users/edit'], { state: { userData: role } });
  }
  editRole(role: any) {
    this.router.navigate(['/edituser'], { state: { roleData: role } });
  }

  viewRole(role: any) {
    console.log('View role:', role);
  }

  trackByRoleName(index: number, role: any) {
    return role.name;
  }
  deleteRole(role: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteClient(role._id).subscribe({
          next: () => {
            this.fetchAllClients();

            Swal.fire('Deleted!', 'The role has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting the role:', err);
            Swal.fire('Failed!', 'Failed to delete the role.', 'error');
          },
        });
      }
    });
  }
}
