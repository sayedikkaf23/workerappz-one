import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../services/admin';
import { ToastrService } from 'ngx-toastr'; // Optional for user feedback4
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-partnercode',
  standalone: false,
  templateUrl: './partnercode.html',
  styleUrl: './partnercode.css'
})
export class Partnercode implements OnInit {
 panterCodes: any[] = [];      
  filteredCodes: any[] = [];    // ← new
  searchTerm = '';              // ← new


  constructor(private router: Router, private adminService: Admin,  private toastr: ToastrService) {}

  ngOnInit(): void {

    
    // this.fetchPanterCodes(); // Fetch the Panter codes on initialization
  }

  // Method to fetch Panter codes
  fetchPanterCodes(): void {
    this.adminService.getAllPanterCode().subscribe(
        (response) => {
        // reverse if you want newest first:
        this.panterCodes = response.reverse();
        this.filteredCodes = [...this.panterCodes];
      },
      (error) => console.error('Error fetching Partner codes:', error)
    );
  }

 onSearch() {
  const term = this.searchTerm.trim().toLowerCase();
  if (!term) {
    this.filteredCodes = [...this.panterCodes];
    return;
  }

  this.filteredCodes = this.panterCodes.filter(pc => {
    const codeMatch = pc.partnerCode.toLowerCase().includes(term);
    const nameMatch = pc.companyname.toLowerCase().includes(term);

    // format dates as strings and lowercase them
    const created = new Date(pc.createdAt)
      .toLocaleString()
      .toLowerCase();
    const updated = new Date(pc.updatedAt)
      .toLocaleString()
      .toLowerCase();

    const createdMatch = created.includes(term);
    const updatedMatch = updated.includes(term);

    return codeMatch || nameMatch || createdMatch || updatedMatch;
  });
}


  exportToExcel(): void {
    const data = this.filteredCodes.map((pc, i) => ({
      No: i + 1,
      'Partner Code': pc.partnerCode,
      'Company Name': pc.companyname,
      Status: pc.status ? 'Active' : 'Inactive',
      'Updated At': new Date(pc.updatedAt).toLocaleString(),
      'Created At': new Date(pc.createdAt).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PartnerCodes');
    XLSX.writeFile(wb, 'partner-codes.xlsx');
  }

  // Additional logic like navigateToRoles, toggleStatus, etc.

  toggleStatus(code: any) {
    code.isActive = !code.isActive;
  }

  toggleDropdown(code: any) {
    this.panterCodes.forEach(r => r.showDropdown = false);
    code.showDropdown = !code.showDropdown;
  }

editCode(code: any) {
  console.log('Edit user:', code);
  this.router.navigate(['/admin/partner-code/edit'], { state: { userData: code } });
}


  viewCode(code: any) {
    console.log('View code:', code);
  }

  deleteCode(code: any) {
    console.log('Delete code:', code);
  }

  trackByCode(index: number, code: any) {
    return code._id; // Assuming Panter codes have unique _id
  }

  navigateToRoles() {
    this.router.navigate(['admin/partner-code/add']);
  }

  trackByPanterCodeId(index: number, panterCode: any) {
    return panterCode._id; // Assuming panter code has a unique _id
  }
  deletePanterCode(panterCode: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to Delete this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deletePanterCode(panterCode._id).subscribe({
          next: (response) => {
             // Remove from the master list…
          this.panterCodes = this.panterCodes.filter(pc => pc._id !== panterCode._id);
          // …and from the filtered list too
          this.filteredCodes = this.filteredCodes.filter(pc => pc._id !== panterCode._id);
            // this.toastr.success('Panter Code deleted successfully'); // Notification
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          },
          error: (err) => {
            console.error('Error deleting Partner Code:', err);
            this.toastr.error('Failed to delete Panter Code'); // Notification
          }
        });
      }
    });
  }
  
}
