import { Component } from '@angular/core';

@Component({
  selector: 'app-step-3',
  standalone: false,
  templateUrl: './step-3.html',
  styleUrl: './step-3.css'
})
export class Step3 {

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
}
