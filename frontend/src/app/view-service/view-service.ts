// src/app/view-service/view-service.ts
import { Component, HostListener, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import {
  AdminService,
  ServiceItem,
  CreateServiceDto,
  UpdateServiceDto,
} from '../services/admin.service';
import { Router } from '@angular/router';


type ServiceVM = ServiceItem & { showDropdown?: boolean };

@Component({
  selector: 'app-view-service',
  standalone: false,
  templateUrl: './view-service.html',
  styleUrls: ['./view-service.css'],
})
export class ViewService implements OnInit {
  services: ServiceVM[] = [];
  filteredServices: ServiceVM[] = [];
  searchTerm = '';
  isLoading = false;

  // Modals
  showCreateModal = false;
  showEditModal = false;

  // Create form
  newService = { name: '', active: true };

  // Edit form
  editServiceData: { _id: string; name: string; active: boolean } | null = null;

  constructor(private adminService: AdminService,private router: Router) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  goToCreate(): void {
  this.router.navigate(['/admin/services/new']);
}

editRow(s: ServiceVM, e?: MouseEvent): void {
  e?.stopPropagation();
  this.router.navigate(['/admin/services', s._id, 'edit'], { state: { service: s } });
}
  // Load
  fetchServices(): void {
    this.isLoading = true;
    this.adminService.listServices().subscribe({
      next: (list) => {
        this.services = (list || []).map((s) => ({ ...s, showDropdown: false }));
        this.filteredServices = [...this.services];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('listServices error:', err);
        Swal.fire('Error', 'Failed to load services', 'error');
      },
    });
  }

  // Search
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredServices = [...this.services];
      return;
    }
    this.filteredServices = this.services.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        (s.active ? 'active' : 'inactive').includes(term)
    );
  }

  // Export
  exportToExcel(): void {
    const data = this.filteredServices.map((s, i) => ({
      No: i + 1,
      Name: s.name,
      Status: s.active ? 'Active' : 'Inactive',
      'Updated On': s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Services');
    XLSX.writeFile(wb, 'services.xlsx');
  }

  // Dropdown
  toggleDropdown(row: ServiceVM, e?: MouseEvent): void {
    e?.stopPropagation();
    this.filteredServices.forEach((r) => (r.showDropdown = false));
    row.showDropdown = !row.showDropdown;
  }

  @HostListener('document:click')
  closeAllDropdowns(): void {
    this.filteredServices.forEach((r) => (r.showDropdown = false));
  }

  // Create
  openCreateModal(): void {
    this.newService = { name: '', active: true };
    this.showCreateModal = true;
  }
  closeCreateModal(): void {
    this.showCreateModal = false;
  }
  saveNewService(): void {
    if (!this.newService.name.trim()) {
      Swal.fire('Validation', 'Service name is required', 'warning');
      return;
    }
    const payload: CreateServiceDto = {
      name: this.newService.name.trim(),
      active: this.newService.active,
    };
    this.isLoading = true;
    this.adminService.createService(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        // res.message === "Service created successfully"
        Swal.fire('Success', res?.message || 'Service created successfully', 'success');
        this.closeCreateModal();
        this.fetchServices();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('createService error:', err);
        Swal.fire('Error', err?.error?.message || 'Failed to create service', 'error');
      },
    });
  }

  // Edit
  openEditModal(row: ServiceVM, e?: MouseEvent): void {
    e?.stopPropagation();
    this.editServiceData = {
      _id: row._id,
      name: row.name,
      active: !!row.active,
    };
    this.showEditModal = true;
  }
  closeEditModal(): void {
    this.showEditModal = false;
  }
  saveEditService(): void {
    const id = this.editServiceData?._id;
    if (!id) return;

    const payload: UpdateServiceDto = {
      name: (this.editServiceData?.name || '').trim(),
      active: !!this.editServiceData?.active,
    };

    this.isLoading = true;
    this.adminService.updateService(id, payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        Swal.fire('Updated', res?.message || 'Service updated successfully', 'success');
        this.closeEditModal();
        this.fetchServices();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('updateService error:', err);
        Swal.fire('Error', err?.error?.message || 'Failed to update service', 'error');
      },
    });
  }

  // Delete
  deleteService(row: ServiceVM): void {
    Swal.fire({
      title: 'Delete service?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((r) => {
      if (r.isConfirmed) {
        this.adminService.deleteService(row._id).subscribe({
          next: (res) => {
            Swal.fire('Deleted', res?.message || 'Service deleted successfully', 'success');
            this.fetchServices();
          },
          error: (err) => {
            console.error('deleteService error:', err);
            Swal.fire('Error', err?.error?.message || 'Failed to delete service', 'error');
          },
        });
      }
    });
  }

  // TrackBy
  trackById(i: number, s: ServiceVM): string | number {
    return s._id || i;
    }
}
