import { Component, OnInit , HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../services/admin';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';  // Import ToastrService
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  roles: any[] = [];            // full list from API
  filteredRoles: any[] = [];    // what the table shows
  searchTerm: string = '';      // bound to your input
  constructor(private router: Router, private adminService: Admin,private toastr: ToastrService) {}

  // Fetch roles on component initialization
  ngOnInit() {
    this.fetchRoles();
  }

   // Close the dropdown if clicked outside
   @HostListener('document:click', ['$event'])
   onClickOutside(event: Event) {
     this.roles.forEach(role => {
       role.showDropdown = false;
     });
   }

  // Method to fetch roles from the backend
  fetchRoles() {
    this.adminService.getAllroles().subscribe(
      (response) => {
        this.roles = response.sort((a:any, b:any) =>
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
);
this.filteredRoles = [...this.roles];

        // this.roles = response;  // Assuming response is an array of roles
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

   onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      // empty → show all
      this.filteredRoles = [...this.roles];
      return;
    }

    this.filteredRoles = this.roles.filter(r =>
      r.role_name.toLowerCase().includes(term) ||
      String(r.status).toLowerCase().includes(term)  // if you want to search status
    );
  }

  exportToExcel(): void {
    const data = this.filteredRoles.map((r, i) => ({
      No: i + 1,
      Role: r.role_name,
      Status: r.status ? 'Active' : 'Inactive',
      'Updated On': new Date(r.updatedAt).toLocaleString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'roles.xlsx');
  }

  // Navigate to the roles page
  navigateToRoles() {
    this.router.navigate(['/roles']);
  }

  // Toggle the active status of a role
  toggleStatus(role: any) {
    // Determine the new status by flipping the current status
    const newStatus = !role.status; // Flip the current status
    
    // Prepare payload with the updated status
    const updatedPayload = { status: newStatus };
    
    // Call the updateRole method to update the role status on the server
    this.adminService.updateRole(updatedPayload, role._id).subscribe(
      (response) => {
        console.log('Role updated successfully:', response);
        
        // Display the dynamic success message directly from the backend
        if (response?.message) {
            this.toastr.success(response.message); 
        }
    
        // Refresh the roles list after a successful update
        this.fetchRoles();
      },
      (error) => {
        console.error('Error updating role:', error);
    
        // Display the dynamic error message directly from the backend
        if (error?.error?.message) {
            this.toastr.error(error.error.message);
        } else {
            this.toastr.error('An unexpected error occurred. Please try again.');
        }
    
        // Optionally revert the status if the update fails
        role.status = !role.status;
      }
    );
  }
    
  

  // Toggle the visibility of the dropdown menu for the role
  toggleDropdown(role: any) {
    // Close other dropdowns
    this.roles.forEach(r => r.showDropdown = false);

    // Toggle the current dropdown
    role.showDropdown = !role.showDropdown;
  }

  // Action handlers
  editRole(role: any) {
    console.log('Edit role:', role);
    // Add edit logic here
  }

  viewRole(role: any) {
    console.log('Navigating with role:', role);
    this.router.navigate(['/viewrole'], { state: { roleData: role } });
    
  }

  
  // TrackBy function for *ngFor to optimize rendering
  trackByRoleName(index: number, role: any) {
    return role.name; // or any unique identifier
  }
  deleteRole(role: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteRole(role._id).subscribe({
          next: () => {
            this.roles = this.roles.filter(r => r._id !== role._id);
              this.filteredRoles = this.filteredRoles.filter(r => r._id !== role._id);

            Swal.fire('Deleted!', 'The role has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting role:', err);
            Swal.fire('Failed!', 'Failed to delete the role.', 'error');
          }
        });
      }
    });
  }

}
