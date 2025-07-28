import { Component, AfterViewInit } from '@angular/core';

declare var $: any;
declare var anime: any;
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  ngAfterViewInit() {
    // Initialize Select2
    $('.flag-select').select2({
      templateResult: this.formatState,
      templateSelection: this.formatState,
    });

    // Animate banner letters
    const textWrapper = document.querySelector('.banner_title .letters');
    if (textWrapper) {
      textWrapper.innerHTML =
        textWrapper.textContent?.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        ) || '';

      anime
        .timeline({ loop: true })
        .add({
          targets: '.banner_title .letter',
          rotateY: [-90, 0],
          duration: 1300,
          delay: (el: any, i: number) => 45 * i,
        })
        .add({
          targets: '.banner_title',
          opacity: 0,
          duration: 1000,
          easing: 'easeOutExpo',
          delay: 1000,
        });
    }
  }

  formatState(opt: any) {
    if (!opt.id) {
      return opt.text;
    }

    const optimage = $(opt.element).data('image');
    if (!optimage) {
      return opt.text;
    } else {
      return $(
        '<span><img src="' +
          optimage +
          '" width="24px" style="margin-right:8px;" /> ' +
          opt.text +
          '</span>'
      );
    }
  }
}
