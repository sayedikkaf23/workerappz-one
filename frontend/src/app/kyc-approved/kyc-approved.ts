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

  formatState(opt: any) {
    if (!opt.id) return opt.text;

    const optimage = $(opt.element).data('image');
    if (!optimage) return opt.text;

    return $(
      `<span><img src="${optimage}" width="38px" style="margin-right: 8px;" /> ${opt.text}</span>`
    );
  }
}
