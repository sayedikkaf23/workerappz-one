import { Component } from '@angular/core';

@Component({
  selector: 'app-update-country',
  standalone: false,
  templateUrl: './update-country.html',
  styleUrl: './update-country.css'
})
export class UpdateCountry {
  
isLoading = false;
  // Dropdown options
  currencies: string[] = ['AED', 'USD', 'INR', 'EUR', 'GBP'];
  transactionTypes: string[] = ['None', 'Cash', 'Bank', 'Wallet'];

  // Form fields
  name = '';
  countryShortname = '';
  selectedCurrency = '';
  outboundCash: number | null = null;
  outboundBank: number | null = null;
  outboundWallet: number | null = null;
  outboundIdThreshold: number | null = null;
  localCurrency = '';
  allowedInternationalType = 'None';
  allowedDomesticType = 'None';
  totalInboundThreshold: number | null = null;
  maxTransactionsPerYear: number | null = null;
  transactionYearStart = '';
  transactionYearEnd = '';
  outboundThresholdPerMonth: number | null = null;
  outboundThresholdPerDay: number | null = null;
  isAsian = false;

  onSubmit(){
    
  }

  goBack(){

  }
  currencyConfigs = [
  {
    currency: '',
    outboundCash: null,
    outboundBank: null,
    outboundWallet: null,
    outboundIdThreshold: null
  }
];

addCurrencyConfig() {
  this.currencyConfigs.push({
    currency: '',
    outboundCash: null,
    outboundBank: null,
    outboundWallet: null,
    outboundIdThreshold: null
  });
}

removeCurrencyConfig(index: number) {
  this.currencyConfigs.splice(index, 1);
}


}
