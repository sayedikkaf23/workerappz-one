import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // <-- Import HttpClientModule
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { Payment } from './payment/payment';
import { Step1 } from './step-1/step-1';
import { Step2 } from './step-2/step-2';
import { Step3 } from './step-3/step-3';
import { Step4 } from './step-4/step-4';
import { Step5 } from './step-5/step-5';
import { Home } from './home/home';
import { KycApproved } from './kyc-approved/kyc-approved';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [App, Login, Register, Payment, Step1, Step2, Step3, Step4, Step5, Home, KycApproved, ],
  imports: [BrowserModule, AppRoutingModule, NgSelectModule, FormsModule,HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
