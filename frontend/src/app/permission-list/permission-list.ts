import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-permission-list',
  standalone: false,
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.css'
})
export class PermissionList {

   isLoading = false; // Loader state
      permissionList:any[] = []; // Array to hold all categories
      paginatedCategories:any[] = []; // Array to hold paginated categories
      currentPage = 1; // Current page number
      totalPages = 1; // Total pages number
      showAddPermissionModal = false;
      searchTerm = ''; // Search term
    
      filteredCategories:any[] = []; 
    
      constructor(private adminService: AdminService) {}
    
      ngOnInit(): void {
        this.loadCurrencies();
      }
      
      handleCategoryAdded(permissionList: { sendCountryName: string, receiveCountryName: string, permission: string }) {
        console.log('Permission added:', permissionList);
        this.showAddPermissionModal = false;
        this.loadCurrencies(); // Reload currencies after adding
      }
    
      loadCurrencies(): void {
        this.isLoading = true;
        this.adminService.getCurrencies().subscribe(
            (res) => {
          // sort newest first
         this.permissionList = res.data;
              this.filteredCategories = this.permissionList;
          this.filterCurrencies();
          this.isLoading = false;
        },
          // (response) => {
            
            // this.categories = response.categories; // Extract categories from response
            // this.filterCategories(); // Apply search filter and pagination
            // this.isLoading = false;
          // },
          (error) => {
            console.error('Error fetching categories:', error);
            this.isLoading = false;
          }
        );
      }
    
      filterCurrencies(): void {
        const searchTermLower = this.searchTerm.toLowerCase().trim();
      
        // If the search term is empty, display all categories
        if (!searchTermLower) {
          this.filteredCategories = [...this.permissionList];
        } else {
          this.filteredCategories = this.permissionList.filter(category => {
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
        this.filterCurrencies(); // Reload paginated categories for the selected page
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
