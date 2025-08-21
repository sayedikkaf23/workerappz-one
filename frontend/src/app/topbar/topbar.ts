import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
   constructor(private router: Router) {}
  
  adminEmail: string | null = null; // Variable to hold the admin email

  dropdownOpen = false;


  ngOnInit(): void {
    this.loadAdminEmail();
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

    toggleSidebar() {
    const htmlEl = document.documentElement;
  htmlEl.setAttribute('data-vertical-style', 'overlay'); // make sure it's present
  if (htmlEl.getAttribute('data-toggled') === 'icon-overlay-close') {
    htmlEl.removeAttribute('data-toggled');
  } else {
    htmlEl.setAttribute('data-toggled', 'icon-overlay-close');
  }
  }


  logout() {
    this.router.navigate(['/admin/login']);
  }


  private loadAdminEmail() {
    this.adminEmail = localStorage.getItem('adminEmail'); // Adjust key if necessary
  }

}
