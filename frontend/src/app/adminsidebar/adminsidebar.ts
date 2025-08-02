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
   permissions: string[] = [];
  isSuperAdmin: boolean = false;

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
  isDropdownOpen: boolean = false;
  sessionStorageKey = 'settingsDropdownOpen';
  settingsRoutes = ['/usersrole', '/user', '/partnercode', '/topup', '/roles', '/viewrole', '/userrole', '/useredit', '/addpartnercode','/mastertransfer','/addip']; // Array of settings routes
  

  ngOnInit() {
    const storedState = sessionStorage.getItem(this.sessionStorageKey);
    this.isDropdownOpen = storedState === 'true';

    // Subscribe to router events to close dropdown on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!this.settingsRoutes.includes(this.router.url)) { // Check if not a settings route
          this.isDropdownOpen = false;
          sessionStorage.setItem(this.sessionStorageKey, 'false'); // Update sessionStorage
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
    sessionStorage.setItem(this.sessionStorageKey, String(this.isDropdownOpen));

    this.ngZone.onStable.subscribe(() => {
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    if (this.isDropdownOpen && this.sidebarMenu) {
      const sidebar = this.sidebarMenu.nativeElement;
      sidebar.scrollTop = sidebar.scrollHeight;
    }
  }

  ngOnDestroy() {
    sessionStorage.setItem(this.sessionStorageKey, String(this.isDropdownOpen));
  }

  logout() {
    this.router.navigate(['/adminlogin']);
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
      this.router.navigate(['/adminlogin']);
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
}
