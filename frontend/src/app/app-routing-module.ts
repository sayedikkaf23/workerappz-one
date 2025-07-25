import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Payment } from './payment/payment';
import { Step1 } from './step-1/step-1';
import { Step2 } from './step-2/step-2';
import { Step3 } from './step-3/step-3';
import { Step4 } from './step-4/step-4';
import { Step5 } from './step-5/step-5';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  { path: 'home', component: Home },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'payment', component: Payment },
  { path: 'step-1', component: Step1 },
  { path: 'step-2', component: Step2 },
  { path: 'step-3', component: Step3 },
  { path: 'step-4', component: Step4 },
  { path: 'step-5', component: Step5 },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
