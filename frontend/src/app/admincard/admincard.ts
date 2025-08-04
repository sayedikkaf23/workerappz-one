import { Component, OnInit } from '@angular/core';
import { Admin} from '../services/admin';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-admincard',
  standalone: false,
  templateUrl: './admincard.html',
  styleUrl: './admincard.css'
})
export class Admincard implements OnInit {
  isLoading = false;
  users: any[] = []; // All users from the API
  filteredUsers: any[] = []; // Users after filtering (search and date)
  paginatedUsers: any[] = []; // Users shown on the current page
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  searchTerm = '';
  partnerCode: any;
  selectedUser: any = null;
  // Date filter fields (assumes each user has a createdAt property)
  fromDate: string = '';
  toDate: string = '';

  constructor(private adminService: Admin) {}

  ngOnInit(): void {
    const adminRole = localStorage.getItem('AdminRole');
    const partnerCode = localStorage.getItem('partnerCode');

    if (!adminRole || adminRole === 'superadmin' || adminRole === 'administrator') {
      this.loadUsers();
    } else {
      this.loadUsersByPartnerCode(partnerCode);
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUser().subscribe(
      (response:any) => {
        this.users = response.data || [];
        this.filterUsers();
        this.isLoading = false;
      },
      (error:any) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  loadUsersByPartnerCode(partnerCode: any): void {
    this.isLoading = true;
    this.adminService.loadUsersByPartnerCode(partnerCode).subscribe(
      (response:any) => {
        this.users = response.data || [];
        this.filterUsers();
        this.isLoading = false;
      },
      (error:any) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }
    );
  }

  // (Optional) Fetch partner codes mapping if needed
  fetchPanterCodes() {
    this.adminService.getPanterCode().subscribe({
      next: (data) => {
        this.partnerCode = data.reduce((acc:any, item: any) => {
          acc[item.partnerCode] = item.companyname;
          return acc;
        }, {});
      },
      error: (err) => console.error('Failed to fetch partner codes:', err)
    });
  }

  // Return company name from partner code (or fallback to "NA")
  getCompanyName(partnercode: string): string {
    return this.partnerCode ? (this.partnerCode[partnercode] || 'NA') : 'NA';
  }

  /**
   * filterUsers() applies a combined filter based on:
   *  - The search term (searching in card IDs, full name, and partner/company name)
   *  - The selected date range (using the user.createdAt property)
   * 
   * It also sorts the filtered results so that the most recent items appear first.
   */
  filterUsers(): void {
    let result = [...this.users];
  
    // Apply search filter if a search term is provided
    const searchTermLower = this.searchTerm.trim().toLowerCase();
    if (searchTermLower) {
      result = result.filter(user => {
        const allCardIds = user.userCardIds ? user.userCardIds.join(' ').toLowerCase() : '';
        const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
        const partnerName = (user.companyname || 'NA').toLowerCase();
        const combinedFields = `${allCardIds} ${fullName} ${partnerName}`;
        return combinedFields.includes(searchTermLower);
      });
    }
  
    // Apply date filter if either fromDate or toDate is provided
    if (this.fromDate || this.toDate) {
      result = result.filter(user => {
        // Convert the createdAt field (which is in ISO/UTC) to a Date object.
        const userDate = new Date(user.createdAt);
        let valid = true;
  
        // Compare with the 'from' date (interpreted as local midnight).
        if (this.fromDate) {
          // new Date(this.fromDate) gives midnight local time of the selected day.
          valid = valid && (userDate >= new Date(this.fromDate));
        }
        if (this.toDate) {
          // Set toDate to the end of the day (local time) to include all records on that date.
          const toDateEnd = new Date(this.toDate);
          toDateEnd.setHours(23, 59, 59, 999);
          valid = valid && (userDate <= toDateEnd);
        }
        return valid;
      });
    }
  
    // Sort the filtered results by createdAt in descending order (most recent first)
   result.sort((a, b) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
this.filteredUsers = result;
this.currentPage = 1;
this.paginateUsers();
  }
  

 paginateUsers(): void {
  this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage) || 1;
  if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

  // sort by date desc, then slice
  const sorted = this.filteredUsers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const start = (this.currentPage - 1) * this.itemsPerPage;
  this.paginatedUsers = sorted.slice(start, start + this.itemsPerPage);
}

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateUsers();
  }

  // exportToExcel(): void {
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
  //        this.filteredUsers.map((user, index) => {
  //     const cardIds = user.userCardIds.join(', ');
  //     return {
  //       No: index + 1,
  //       'Card ID': cardIds,
  //       Name: `${user.firstname} ${user.lastname}`,
  //       'Partner Code': user.companyname !== '' ? user.companyname : 'NA',
  //       'Date Created': new Date(user.createdAt).toLocaleString()
  //     };
  //   })
  //   );
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Cards');
  //   XLSX.writeFile(wb, 'cards.xlsx');
  // }

  // Modal methods to display all card IDs for a user
  // openModal(user: any): void {
  //   this.selectedUser = user;
  // }
  
  closeModal(): void {
    this.selectedUser = null;
  }
// now exportToExcel:
exportToExcel(): void {
  // 1) use the already-sorted filteredUsers
  const rows = this.filteredUsers.flatMap((user, userIdx) =>
    (user.userCardIds || []).map((cardId:any, cardIdx:any) => {
      const dt = new Date(user.createdAt);
      return {
        No:             cardIdx === 0 ? userIdx + 1 : '',
        'Card ID':      cardId,
        Name:           `${user.firstname} ${user.lastname}`,
        'Partner Name': user.companyname || 'NA',
        'Date Created': isNaN(dt.getTime()) ? 'N/A' : dt.toLocaleString()
      };
    })
  );

  // 2) build sheet
  const ws = XLSX.utils.json_to_sheet(rows, {
    header: ['No','Card ID','Name','Partner Name','Date Created']
  });

  // 3) column widths & wrapText
  ws['!cols'] = [
    { wch: 5  },
    { wch: 35 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 }
  ];
  rows.forEach((_, i) => {
    const cell = ws['B' + (i + 2)];
    if (cell) cell.s = { alignment: { wrapText: true, indent: 1, vertical: 'top' } };
  });
  ws['!rows'] = rows.map(r => {
    const lines = (r['Card ID'] as string).split('\n').length;
    return { hpt: lines * 20 + 5 };
  });

  // 4) export
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cards');
  XLSX.writeFile(wb, 'cards.xlsx');
}




}
