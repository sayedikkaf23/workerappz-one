import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
 currencies = [
    { value: 'usd', text: 'USD', image: 'assets/images/usd.png' },
    { value: 'sgd', text: 'SGD', image: 'assets/images/sgd.png' },
    { value: 'china', text: 'China', image: 'assets/images/china.png' },
    { value: 'india', text: 'India', image: 'assets/images/india.png' }
  ];

  selectedCurrency = this.currencies[0].value;
   selectedCurrency2 = this.currencies[0].value;
  dropdownOpen = false;
  dropdownOpen2 = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropdown2() {
    this.dropdownOpen2 = !this.dropdownOpen2;
  }

  selectCurrency(currency: any) {
    this.selectedCurrency = currency.value;
    this.dropdownOpen = false;
  }

    selectCurrency2(currency: any) {
    this.selectedCurrency2 = currency.value;
    this.dropdownOpen2 = false;
  }

  getSelectedCurrency() {
    return this.currencies.find(c => c.value === this.selectedCurrency);
  }

  getSelectedCurrency2() {
    return this.currencies.find(c => c.value === this.selectedCurrency2);
  }

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
