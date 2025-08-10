import { Component, HostListener, OnInit } from '@angular/core'; // 👈 make sure HostListener is imported
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService, Role } from '../services/admin.service';

type RoleVM = Role & { showDropdown?: boolean };

@Component({
  selector: 'app-view-role',
  standalone: false,
  templateUrl: './view-role.html',
  styleUrls: ['./view-role.css'],
})
export class ViewRole implements OnInit {
  roles: RoleVM[] = [];
  filteredRoles: RoleVM[] = [];
  searchTerm = '';
  isLoading = false;

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchRoles();
  }


    toggleDropdown(row: RoleVM, e?: MouseEvent) {
    e?.stopPropagation();
    this.filteredRoles.forEach(x => (x.showDropdown = false));
    row.showDropdown = !row.showDropdown;
  }

  // API: list
  fetchRoles(): void {
    this.isLoading = true;
    this.adminService.getRoles().subscribe({
      next: (list) => {
        this.roles = (list || []).map(r => ({ ...r, showDropdown: false }));
        this.filteredRoles = [...this.roles];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('getRoles error:', err);
        Swal.fire('Error', 'Failed to load roles', 'error');
      }
    });
  }

  // search
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) { this.filteredRoles = [...this.roles]; return; }
    this.filteredRoles = this.roles.filter(r =>
      r.role_name?.toLowerCase().includes(term) ||
      (r.permissions || []).join(',').toLowerCase().includes(term)
    );
  }

  // actions dropdown
  // toggleDropdown(row: RoleVM, e?: MouseEvent) {
  //   e?.stopPropagation();
  //   this.filteredRoles.forEach(x => (x.showDropdown = false));
  //   row.showDropdown = !row.showDropdown;
  // }

  @HostListener('document:click')
  closeAllDropdowns() {
    this.filteredRoles.forEach(x => (x.showDropdown = false));
  }

  // navigate to add/edit
  goToCreate(): void {
    this.router.navigate(['/admin/roles/new']);
  }

  editRow(r: RoleVM, e?: MouseEvent): void {
    e?.stopPropagation();
    this.router.navigate(['/admin/roles', r._id, 'edit'], { state: { role: r } });
  }

  // delete
  deleteRow(r: RoleVM): void {
    Swal.fire({
      title: 'Delete role?',
      text: 'This role will be marked as deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then(res => {
      if (res.isConfirmed) {
        this.adminService.deleteRole(r._id).subscribe({
          next: (resp) => {
            Swal.fire('Deleted', resp?.message || 'Role deleted successfully', 'success');
            this.fetchRoles();
          },
          error: (err) => {
            console.error('deleteRole error:', err);
            Swal.fire('Error', err?.error?.message || 'Failed to delete role', 'error');
          }
        });
      }
    });
  }

  // trackBy
  trackById(i: number, r: RoleVM) { return r._id || i; }
}
