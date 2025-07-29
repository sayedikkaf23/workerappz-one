import { Component } from '@angular/core';

@Component({
  selector: 'app-step-4',
  standalone: false,
  templateUrl: './step-4.html',
  styleUrl: './step-4.css'
})
export class Step4 {

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
