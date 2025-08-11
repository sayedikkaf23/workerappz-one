import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute , NavigationEnd} from '@angular/router';
import { Admin } from '../services/admin';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { Profile } from '../profile/profile';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-adminsidebar',
  standalone: false,
  templateUrl: './adminsidebar.html',
  styleUrl: './adminsidebar.css'
})
export class Adminsidebar {
    isDropdownOpen: boolean = false;

   permissions: string[] = [];
  isSuperAdmin: boolean = false;
  isMasterOpen = false;
isGlobalOpen = false;

masterRoutes = [
  '/admin/master/global/credit-limit',
  '/admin/master/global/transaction-limit',
];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminService: Admin,
    private dialog: MatDialog, // Inject MatDialog here
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {
    this.loadPermissions(); // Call the function to load permissions on initialization
  }


  @ViewChild('sidebarMenu') sidebarMenu: ElementRef | undefined;
  sessionStorageKey = 'settingsDropdownOpen';
  settingsRoutes = ['/admin/users/roles', '/admin/users/edit','/admin/users', '/admin/partner-code', '/admin/topup', '/admin/roles', '/admin/roles/view', '/admin/roles/assign', '/admin/users/update', '/admin/partner-code/add','/admin/fund/master-transfer','/admin/ip-address/add', '/admin/ip-address/list', '/admin/ip-address/edit/:id']; // Array of settings routes
  
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
 ngOnInit() {
  const storedSettings = sessionStorage.getItem(this.sessionStorageKey);
  this.isDropdownOpen = storedSettings === 'true';

  this.isMasterOpen = sessionStorage.getItem('masterOpen') === 'true';
  this.isGlobalOpen = sessionStorage.getItem('globalOpen') === 'true';

  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // close Settings when leaving its routes
      if (!this.settingsRoutes.includes(this.router.url)) {
        this.isDropdownOpen = false;
        sessionStorage.setItem(this.sessionStorageKey, 'false');
      }
      // close Master when leaving its routes
      if (!this.masterRoutes.includes(this.router.url)) {
        this.isMasterOpen = false;
        this.isGlobalOpen = false;
        sessionStorage.setItem('masterOpen', 'false');
        sessionStorage.setItem('globalOpen', 'false');
      }
    }
  });
}

ngOnDestroy() {
  sessionStorage.setItem(this.sessionStorageKey, String(this.isDropdownOpen));
  sessionStorage.setItem('masterOpen', String(this.isMasterOpen));
  sessionStorage.setItem('globalOpen', String(this.isGlobalOpen));
}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  scrollToBottom() {
    if (this.isDropdownOpen && this.sidebarMenu) {
      const sidebar = this.sidebarMenu.nativeElement;
      sidebar.scrollTop = sidebar.scrollHeight;
    }
  }

 

  logout() {
    this.router.navigate(['/admin/login']);
  }

  isActive(route: string): boolean {
    // Implement logic to check if the route is active
    return this.router.url === route;
  }

  // Load permissions from the API using the AdminService
  loadPermissions(): void {
    const adminId = localStorage.getItem('AdminID');
    if (adminId) {
      // this.adminService.Premisson(adminId).subscribe(
      //   (response) => {
      //     if (response && response.partnerCode) {
      //       if (response.partnerCode === 'superadmin') {
              this.isSuperAdmin = true;
      //       } else if (response.role && response.role.permissions) {
      //         this.permissions = response.role.permissions;
      //       }
      //     }
      //     this.changeDetector.detectChanges(); // Force UI Update
      //   },
      //   (error) => {
      //     console.error('Error loading admin permissions', error);
      //   }
      // );
    } else {
      console.error('No AdminID found in localStorage');
      this.router.navigate(['/admin/login']);
    }
  }

  hasPermission(permission: string): boolean {
    if (this.isSuperAdmin) {
      return true;
    }
    return this.permissions.includes(permission);
  }

  openProfile(): void {
    const dialogRef = this.dialog.open(Profile, {
      width: '800px', // Set a wider width

      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        nationality: 'American',
        phone: '123456789',
        address: '1234 Elm Street, Springfield',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Profile Updated:', result);
      }
    });
  }

  toggleDropdown(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  this.isDropdownOpen = !this.isDropdownOpen;

  // close Master/Global when Settings opens
  if (this.isDropdownOpen) {
    this.isMasterOpen = false;
    this.isGlobalOpen = false;
  }
  sessionStorage.setItem(this.sessionStorageKey, String(this.isDropdownOpen));
}

toggleMaster(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  this.isMasterOpen = !this.isMasterOpen;

  // close Settings when Master opens
  if (this.isMasterOpen) {
    this.isDropdownOpen = false;
    sessionStorage.setItem(this.sessionStorageKey, 'false');
  }

  // optional: collapse Global when closing Master
  if (!this.isMasterOpen) this.isGlobalOpen = false;

  this.ngZone.onStable.subscribe(() => this.scrollToBottom());
}

toggleGlobal(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  this.isGlobalOpen = !this.isGlobalOpen;
}
}
