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
import { KycApproved } from './kyc-approved/kyc-approved';
import { AdminLogin } from './admin-login/admin-login';
import { BusinessUser } from './business-user/business-user';
import { Admincategory } from './admincategory/admincategory';
import { Adminwallet } from './adminwallet/adminwallet';
import { Admincard } from './admincard/admincard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Transferhistory } from './transferhistory/transferhistory';
import { Edituser } from './edituser/edituser';
import { UserEdit } from './user-edit/user-edit';
import { MasterTransfer } from './master-transfer/master-transfer';
import { AddIpaddress } from './add-ipaddress/add-ipaddress';
import { ShowIpaddress } from './show-ipaddress/show-ipaddress';
import { EditIpaddress } from './edit-ipaddress/edit-ipaddress';
import { ViewRole } from './view-role/view-role';
import { Users } from './users/users';
import { Roles } from './roles/roles';
import { User } from './user/user';
import { Userrole } from './userrole/userrole';
import { Partnercode } from './partnercode/partnercode';
import { AddPartnercode } from './add-partnercode/add-partnercode';
import { EditPartnercode } from './edit-partnercode/edit-partnercode';
import { Transferfund } from './transferfund/transferfund';
import { Topup } from './topup/topup';
import { PrefundTransfer } from './prefund-transfer/prefund-transfer';
import { Dashboard } from './services/dashboard';
import { Dashboards } from './dashboards/dashboards';
import { PersonalBank } from './personal-bank/personal-bank';
import { PersonalReviewOrder } from './personal-review-order/personal-review-order';
import { AddAdmin } from './add-admin/add-admin';
import { ServiceForm } from './service-form/service-form';
import { ViewService } from './view-service/view-service';
import { MasterGlobalCreditLimit } from './master-global-credit-limit/master-global-credit-limit';
import { MasterGlobalTransactionLimit } from './master-global-transaction-limit/master-global-transaction-limit';
import { CurrencyManagement } from './currency-management/currency-management';
import { CountryManagement } from './country-management/country-management';
import { AddCountry } from './add-country/add-country';
import { UpdateCountry } from './update-country/update-country';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer/home',
    pathMatch: 'full',
  },
  { path: 'customer/home', component: Home },
  { path: 'customer/login', component: Login },
  { path: 'customer/register', component: Register },
  { path: 'customer/payment', component: Payment },
  { path: 'customer/step-1', component: Step1 },
  { path: 'customer/step-2', component: Step2 },
  // { path: 'customer/step-3', component: Step3 },
  { path: 'customer/step-4', component: Step4 },
  { path: 'customer/step-5', component: Step5 },
  { path: 'customer/personal-bank', component: PersonalBank },
  { path: 'customer/business-bank', component: Step3 },
  { path: 'customer/personal-review', component: PersonalReviewOrder },

  { path: 'customer/kyc-approved', component: KycApproved },

  // admin
  { path: 'admin/login', component: AdminLogin },
  // { path: 'admin/admindashboard', component: AdminDashboard },
  {
    path: 'admin',
    children: [
      // { path: 'login', component: AdminLogin },
      { path: 'dashboard', component: AdminDashboard },
      // app-routing.module.ts (inside the existing 'admin' children array)
      {
        path: 'master/global/credit-limit',
        component: MasterGlobalCreditLimit,
      },
      {
        path: 'master/global/transaction-limit',
        component: MasterGlobalTransactionLimit,
      },

      { path: 'home', component: Dashboards },

      // User & Roles
      { path: 'admin', component: User },
      { path: 'users/edit', component: Edituser },
      { path: 'users/update', component: UserEdit },
      { path: 'users/roles', component: Users },
      { path: 'roles', component: Roles },
      { path: 'roles/:id/edit', component: Roles },
      { path: 'roles/view', component: ViewRole },
      { path: 'roles/assign', component: Userrole },
      { path: 'add/admin', component: AddAdmin },
      { path: 'admins/:id/edit', component: AddAdmin },

      // Partner Codes
      { path: 'partner-code', component: Partnercode },
      { path: 'partner-code/add', component: AddPartnercode },
      { path: 'partner-code/edit', component: EditPartnercode },

      // Fund Transfer
      { path: 'fund/transfer', component: Transferfund },
      { path: 'fund/prefund-transfer', component: PrefundTransfer },
      { path: 'fund/master-transfer', component: MasterTransfer },
      { path: 'fund/transfer-history', component: Transferhistory },

      // Wallet & Card
      { path: 'wallet', component: Adminwallet },
      { path: 'cards', component: Admincard },
      { path: 'services', component: ViewService },
      { path: 'services/new', component: ServiceForm },
      { path: 'services/:id/edit', component: ServiceForm },

      // Topup
      { path: 'topup', component: Topup },

      // Business Users
      { path: 'business-users', component: BusinessUser },

      // Categories
      { path: 'categories', component: Admincategory },

      // IP Address Management
      { path: 'ip-address/add', component: AddIpaddress },
      { path: 'ip-address/list', component: ShowIpaddress },
      { path: 'ip-address/edit/:id', component: EditIpaddress },

      { path: 'currency-management', component: CurrencyManagement },

     //MASTER  // Country Management
      { path: 'master/country', component: CountryManagement},
      { path: 'master/country/add', component: AddCountry},
      { path: 'master/country/edit:id', component: UpdateCountry},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
