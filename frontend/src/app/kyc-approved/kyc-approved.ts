import { Component, AfterViewInit } from '@angular/core';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-kyc-approved',
  standalone: false,
  templateUrl: './kyc-approved.html',
  styleUrl: './kyc-approved.css'
})
export class KycApproved {

   isDark = true;
toggleDarkMode() {
  this.isDark = !this.isDark;
  const wrapper = document.querySelector('.theme-wrapper');
  if (wrapper) {
    if (this.isDark) {
      wrapper.classList.add('dark-active');
    } else {
      wrapper.classList.remove('dark-active');
    }
  }
}


  ngAfterViewInit(): void {
    // Overlay menu hide
    $('.overlay').on('click', () => {
      $('body').removeClass('menu_show');
    });

    // Navbar toggle
    $('.navbar-icon').on('click', () => {
      $('body').toggleClass('menu_show');
    });

    // Initialize Select2 with flag images
    $('.flag-select').select2({
      templateResult: this.formatState,
      templateSelection: this.formatState
    });

    // Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
}


  formatState(opt: any) {
    if (!opt.id) return opt.text;

    const optimage = $(opt.element).data('image');
    if (!optimage) return opt.text;

    return $(
      `<span><img src="${optimage}" width="38px" style="margin-right: 8px;" /> ${opt.text}</span>`
    );
  }
}
