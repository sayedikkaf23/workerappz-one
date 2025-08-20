import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Admin } from '../services/admin';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { Profile } from '../profile/profile';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-adminsidebar',
  standalone: false,
  templateUrl: './adminsidebar.html',
  styleUrl: './adminsidebar.css',
})
export class Adminsidebar {
  isDropdownOpen: boolean = false;

  permissions: string[] = [];
  isSuperAdmin: boolean = false;
  isMasterOpen = false;
  isGlobalOpen = false;
  showGlobal = false;
  hoveringFlyout = false;
  globalStyle: any = { top: '0px', left: '0px', width: '260px' };
  activeFlyout: string | null = null;
  flyoutStyle: any = {};
  showFlyout = false;
  flyoutItems: { label: string; link: string }[] = [];

  masterRoutes = [
    '/admin/master/global/credit-limit',
    '/admin/master/global/transaction-limit',
    '/admin/master/country',
    '/admin/master/country/add',
    '/admin/master/country/edit/:id',
  ];
open: any = {
  pages: false,    // MASTER
  Global: false,   // MASTER > Global
  Settings: false,
};

suppress: any = {
  pages: false,
  Global: false,
  Settings: false,
};
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminService: Admin,
    private dialog: MatDialog, // Inject MatDialog here
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef,
    private auth: AuthService,
    
  ) {
this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {
      if (!this.suppress.Settings) {
        this.open.Settings = this.isActive(['/admin/settings']) || this.open.Settings;
      }
      if (!this.suppress.pages) {
        this.open.pages = this.isActive(['/admin/master']) || this.open.pages;
      }
      if (!this.suppress.Global) {
        this.open.Global = this.isActive(['/admin/master/global']) || this.open.Global;
      }
    });
    
  }
  

  @ViewChild('sidebarMenu', { static: false }) sidebarMenu?: ElementRef;
toggleMenu(key: 'pages'|'Global'|'Settings') {
  const next = !this.open[key];
  this.open[key] = next;
  // if user closes manually, suppress auto-open; if opens, clear suppress
  this.suppress[key] = !next;
}

isActive(paths: string[]): boolean {
  return paths.some(p =>
    this.router.isActive(p, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    })
  );
}
  // @ViewChild('sidebarMenu') sidebarMenu: ElementRef | undefined;
  sessionStorageKey = 'settingsDropdownOpen';
  settingsRoutes = [
    '/admin/users/roles',
    '/admin/users/edit',
    '/admin/users',
    '/admin/partner-code',
    '/admin/topup',
    '/admin/roles',
    '/admin/roles/view',
    '/admin/roles/assign',
    '/admin/users/update',
    '/admin/partner-code/add',
    '/admin/fund/master-transfer',
    '/admin/ip-address/add',
    '/admin/ip-address/list',
    '/admin/ip-address/edit/:id',
  ]; // Array of settings routes
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  


  ngOnInit() {
    const storedSettings = sessionStorage.getItem(this.sessionStorageKey);
    this.isDropdownOpen = storedSettings === 'true';

    this.isMasterOpen = sessionStorage.getItem('masterOpen') === 'true';
    this.isGlobalOpen = sessionStorage.getItem('globalOpen') === 'true';

    this.router.events.subscribe((event) => {
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

// open: any = {
//   pages: false,
//   Global: false,
//   Settings: false,
// };

// toggleMenu(key: 'pages'|'Global'|'Settings') {
//   this.open[key] = !this.open[key];
// }


// isActive(paths: string[]): boolean {
//   return paths.some(p => this.router.isActive(p, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }));
// }

  debug() {
    console.log('Debug clicked');
  }

  // isActive(routeArray: string[]): boolean {
  //   return routeArray.some((r) => this.router.url.startsWith(r));
  // }

  // isActive(route: string): boolean {
  //   // Implement logic to check if the route is active
  //   return this.router.url === route;
  // }

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

  openFlyout(
    event: Event,
    name: string,
    items: { label: string; link: string }[]
  ) {
    event.preventDefault();
    event.stopPropagation();

    // set active and menu content
    this.activeFlyout = name;
    this.flyoutItems = items;
    this.showFlyout = true;

    // position next to clicked item
    const item = (event.currentTarget as HTMLElement).closest(
      'li'
    ) as HTMLElement;
    const rect = item.getBoundingClientRect();
    const sidebarRect = document
      .querySelector('.sidebar')!
      .getBoundingClientRect();
    const left = sidebarRect.right;
    let top = rect.top;

    const margin = 8;
    const panelHeight = items.length * 44 + 16;
    if (top + panelHeight + margin > window.innerHeight) {
      top = Math.max(margin, window.innerHeight - panelHeight - margin);
    }
    this.flyoutStyle = { top: `${top}px`, left: `${left}px`, width: '240px' };
  }

  closeFlyout() {
    this.showFlyout = false;
    this.activeFlyout = null;
  }

  openGlobal(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const item = (e.currentTarget as HTMLElement).closest('li') as HTMLElement;

    const itemRect = item.getBoundingClientRect();
    const sbRect = sidebar.getBoundingClientRect();

    const panelWidth = 260; // same as CSS width
    const left = sbRect.right; // right next to sidebar

    // Provisional top aligned to the item
    let top = itemRect.top;

    // Keep inside viewport
    const viewportH = window.innerHeight;
    const margin = 8;
    const estimatedPanelH = 120; // quick safe default; updated next tick

    if (top + estimatedPanelH + margin > viewportH) {
      top = Math.max(margin, viewportH - estimatedPanelH - margin);
    }

    this.globalStyle = {
      top: `${top}px`,
      left: `${left}px`,
      width: `${panelWidth}px`,
    };
    this.showGlobal = true;

    // Re-measure once it renders to clamp precisely
    setTimeout(() => {
      const panel = document.querySelector('.flyout-panel') as HTMLElement;
      if (!panel) return;
      const h = panel.getBoundingClientRect().height;
      let t = itemRect.top;
      if (t + h + margin > viewportH)
        t = Math.max(margin, viewportH - h - margin);
      this.globalStyle = {
        top: `${t}px`,
        left: `${left}px`,
        width: `${panelWidth}px`,
      };
    });

    // close on outside click
    const onDoc = (ev: MouseEvent) => {
      const panel = document.querySelector('.flyout-panel');
      if (
        !panel ||
        (!panel.contains(ev.target as Node) &&
          !item.contains(ev.target as Node))
      ) {
        this.showGlobal = false;
        document.removeEventListener('click', onDoc);
      }
    };
    setTimeout(() => document.addEventListener('click', onDoc));
  }

  closeGlobal() {
    this.showGlobal = false;
  }

  toggleMaster(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.isMasterOpen = !this.isMasterOpen;
    if (this.isMasterOpen) this.isGlobalOpen = false; // optional
  }

  toggleGlobal(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.isGlobalOpen = !this.isGlobalOpen;
  }

  // logout
  onLogout(event?: Event) {
    event?.preventDefault();
    this.auth.logout();
    this.router.navigate(['/admin/login'], { replaceUrl: true });
  }
  isActivePrefix(prefix: string): boolean {
  return this.router.url.startsWith(prefix);
}
}
