import { Component } from '@angular/core';

@Component({
  selector: 'app-add-country',
  standalone: false,
  templateUrl: './add-country.html',
  styleUrl: './add-country.css'
})
export class AddCountry {

isLoading = false;
  // Dropdown options
  currencies: string[] = ['AED', 'USD', 'INR', 'EUR', 'GBP'];
  transactionTypes: string[] = [ 'Send', 'Receive', 'SendReceive'];

  // Form fields
  name = '';
  countryShortname = '';
  selectedCurrency = '';
  outboundCash: number | null = null;
  outboundBank: number | null = null;
  outboundWallet: number | null = null;
  outboundIdThreshold: number | null = null;
  localCurrency = '';
  allowedInternationalType = '';
  allowedDomesticType = '';
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
