import { Component } from '@angular/core';

@Component({
  selector: 'app-step-5',
  standalone: false,
  templateUrl: './step-5.html',
  styleUrl: './step-5.css'
})
export class Step5 {

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
