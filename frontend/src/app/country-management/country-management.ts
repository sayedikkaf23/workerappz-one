import { Component, AfterViewInit } from '@angular/core';

import { AdminService } from '../services/admin.service';
import * as XLSX from 'xlsx';
import { Router} from '@angular/router';

@Component({
  selector: 'app-country-management',
  standalone: false,
  templateUrl: './country-management.html',
  styleUrl: './country-management.css'
})
export class CountryManagement {

  isLoading = false; // Loader state
    currencies:any[] = []; // Array to hold all categories
    paginatedCategories:any[] = []; // Array to hold paginated categories
    currentPage = 1; // Current page number
    totalPages = 1; // Total pages number
      countryData:any[] = []; // To hold country details
    searchTerm = ''; // Search term
  
    filteredCategories:any[] = []; 
  countryId: number = 0; // 0 means all countries, or you can set it to a specific country ID if needed
    constructor(private adminService: AdminService, private router: Router) {}
  
    ngOnInit(): void {
      this.loadCountries();
      
    }

     ngAfterViewInit(): void {
  }
  
 
  
    loadCountries(): void {
      this.isLoading = true;
      this.adminService.getCountryDetails(this.countryId).subscribe({
      next: (data) => {
        this.countryData = data.resData;
               this.filteredCategories = this.countryData;
        this.filterCountries();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching country details', err);
         this.isLoading = false;
      }
    });
     
    }
  
    filterCountries(): void {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
    
      // If the search term is empty, display all categories
      if (!searchTermLower) {
        this.filteredCategories = [...this.countryData];
      } else {
        this.filteredCategories = this.countryData.filter(category => {
          // Convert each property to a string for comparison
          const name = category.name.toLowerCase();
          const code = category.code.toLowerCase();
          // const factor = category.factor.toString().toLowerCase();
          // const priority = category.priority.toString().toLowerCase();
          // const status = (category.is_active ? 'active' : 'inactive').toLowerCase();
    
          // Check if any of the properties include the search term
          return (
            name.includes(searchTermLower) ||
            code.includes(searchTermLower) 
           
          );
        });
      }
    
      // Reapply pagination after filtering
      this.paginateCategories(this.filteredCategories);
    }
    
  
    paginateCategories(filteredCategories: any[]): void {
      const itemsPerPage = 10;
      const startIndex = (this.currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      this.paginatedCategories = filteredCategories.slice(startIndex, endIndex);
      this.totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    }
  
    goToPage(page: number): void {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.filterCountries(); // Reload paginated categories for the selected page
    }
  
    approveCard(category: any): void {
      console.log('Approved:', category);
    }
  
    rejectCard(category: any): void {
      console.log('Rejected:', category);
    }
  
    viewCategoryDetails(category: any): void {
      console.log('Viewing Details:', category);
    }
    openAddCountry(){
      this.router.navigate(['/admin/master/country/add']);
    }
  
    // exportToExcel(): void {
    //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredCategories.map((category, index) => ({
    //     Name: category.name,
    //     Amount: category.default_amount,
    //     Factor: category.factor,
    //     Priority: category.priority,
    //     Status: category.is_active ? 'Active' : 'Inactive'
    //   })));
  
    //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Categories');
  
    //   XLSX.writeFile(wb, 'categories.xlsx');
    // }
  //   exportToExcel(): void {
  //   // 1) sort for export
  //   const sorted = [...this.filteredCategories].sort(
  //     (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
  //   );
  
  //   // 2) build flat rows
  //   const data = sorted.map(cat => ({
  //     Name:     cat.name,
  //     Amount:   cat.default_amount,
  //     Factor:   cat.factor,
  //     Priority: cat.priority,
  //     Status:   cat.is_active ? 'Active' : 'Inactive',
     
  //   }));
  
  //   // 3) sheet + explicit headers
  //   const ws = XLSX.utils.json_to_sheet(data, {
  //     header: ['Name','Amount','Factor','Priority','Status']
  //   });
  
  //   // 4) bump up column widths
  //   ws['!cols'] = [
  //     { wch: 30 }, // Name
  //     { wch: 12 }, // Amount
  //     { wch: 10 }, // Factor
  //     { wch: 10 }, // Priority
  //     { wch: 12 }, // Status
  //     { wch: 15 }, // Date
  //     { wch: 12 }  // Time
  //   ];
  
  //   // 5) optional: indent “Name” so it’s not flush
  //   data.forEach((_, i) => {
  //     const cell = ws['A' + (i + 2)];
  //     if (cell) cell.s = { alignment: { indent: 1 } };
  //   });
  
  //   // 6) export
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Categories');
  //   XLSX.writeFile(wb, 'categories.xlsx');
  // }
  exportToExcel(): void {
    // 1) sort for export
    // const sorted = [...this.filteredCategories].sort(
    //   (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
    // );
  
    // // 2) build flat rows with all columns
    // const data = sorted.map(cat => ({
    //   Name:     cat.name,
    //   Amount:   cat.default_amount,
    //   Factor:   cat.factor,
    //   Priority: cat.priority,
    //   Status:   cat.is_active ? 'Active' : 'Inactive',
    //   Date:     new Date(cat.date_added).toLocaleDateString(),
    //   Time:     new Date(cat.date_added).toLocaleTimeString()
    // }));
  
    // // 3) generate worksheet
    // const ws = XLSX.utils.json_to_sheet(data, {
    //   header: ['Name', 'Amount', 'Factor', 'Priority', 'Status', 'Date', 'Time']
    // });
  
    // // 4) optional: adjust column widths
    // ws['!cols'] = [
    //   { wch: 30 }, // Name
    //   { wch: 12 }, // Amount
    //   { wch: 10 }, // Factor
    //   { wch: 10 }, // Priority
    //   { wch: 12 }, // Status
    //   { wch: 15 }, // Date
    //   { wch: 12 }  // Time
    // ];
  
    // 5) export
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    // XLSX.writeFile(wb, `Categories_${new Date().getTime()}.xlsx`);
  }

}
