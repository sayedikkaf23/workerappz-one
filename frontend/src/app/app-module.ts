import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { Payment } from './payment/payment';
import { Step1 } from './step-1/step-1';
import { Step2 } from './step-2/step-2';
import { Step3 } from './step-3/step-3';
import { Step4 } from './step-4/step-4';

@NgModule({
  declarations: [App, Login, Register, Payment, Step1, Step2, Step3, Step4, ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
