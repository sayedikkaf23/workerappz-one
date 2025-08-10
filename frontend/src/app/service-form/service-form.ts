import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {
  AdminService,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceItem,
} from '../services/admin.service';

@Component({
  selector: 'app-service-form',
  standalone: false,
  templateUrl: './service-form.html',
  styleUrls: ['./service-form.css'],
})
export class ServiceForm implements OnInit {
  isEdit = false;
  id: string | null = null;

  // form fields
  name = '';
  active = true;

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      // Try to use data from router state first
      const state = history.state as { service?: ServiceItem };
      if (state?.service) {
        this.name = state.service.name;
        this.active = !!state.service.active;
      } else {
        // Fallback: try to load by id (requires backend GET /service/:id)
        this.tryLoadById(this.id);
      }
    }
  }

  private tryLoadById(id: string) {
    // If you have GET /service/:id, uncomment this and add method in AdminService
    // this.isLoading = true;
    // this.adminService.getServiceById(id).subscribe({
    //   next: (svc) => {
    //     this.name = svc?.name || '';
    //     this.active = !!svc?.active;
    //     this.isLoading = false;
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //     Swal.fire('Error', 'Could not load service details', 'error');
    //   },
    // });
  }

  onSubmit(): void {
    if (!this.name.trim()) {
      Swal.fire('Validation', 'Service name is required', 'warning');
      return;
    }

    if (this.isEdit && this.id) {
      const payload: UpdateServiceDto = {
        name: this.name.trim(),
        active: this.active,
      };
      this.isLoading = true;
      this.adminService.updateService(this.id, payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          Swal.fire('Updated', res?.message || 'Service updated successfully', 'success')
            .then(() => this.router.navigate(['/admin/services']));
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', err?.error?.message || 'Failed to update service', 'error');
        },
      });
    } else {
      const payload: CreateServiceDto = {
        name: this.name.trim(),
        active: this.active,
      };
      this.isLoading = true;
      this.adminService.createService(payload).subscribe({
        next: (res) => {
          this.isLoading = false;
          Swal.fire('Success', res?.message || 'Service created successfully', 'success')
            .then(() => this.router.navigate(['/admin/services']));
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error', err?.error?.message || 'Failed to create service', 'error');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/services']);
  }
}
