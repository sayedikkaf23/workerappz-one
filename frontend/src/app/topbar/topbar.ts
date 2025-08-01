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

  toggleSidebar(): void {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }

  logout() {
    this.router.navigate(['/adminlogin']);
  }


  private loadAdminEmail() {
    this.adminEmail = localStorage.getItem('adminEmail'); // Adjust key if necessary
  }

}
