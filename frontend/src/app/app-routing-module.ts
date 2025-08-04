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
  { path: 'kyc-approved', component: KycApproved },

  // admin
  { path: 'admin/login', component: AdminLogin },
  { path: 'admindashboard', component: AdminDashboard },
  { path: 'usersrole', component: Users},
  // { path: '', redirectTo: '/users/role', pathMatch: 'full' },
  { path: 'roles', component: Roles },
  { path: 'user', component: User},
  { path: 'userrole', component: Userrole },
  { path: 'partnercode', component: Partnercode },
  { path: 'addpartnercode', component: AddPartnercode },
  { path: 'editpartnercode', component: EditPartnercode },
  { path: 'transferfund', component: Transferfund},
  { path: 'prefundtransfer', component: PrefundTransfer },

  { path: 'topup', component: Topup },
    { path: 'business-user', component: BusinessUser },
  { path: 'admincategory', component: Admincategory },
  { path: 'adminwallet', component: Adminwallet },
  { path: 'admincard', component: Admincard },
   { path: 'adminhome', component: Dashboards },
   { path: 'transferhistory', component: Transferhistory },
  { path: 'viewrole', component: ViewRole },
  { path: 'edituser', component: Edituser },
  { path: 'useredit', component: UserEdit },
  { path: 'mastertransfer', component: MasterTransfer },
    { path: 'addip', component: AddIpaddress },
        { path: 'getip', component: ShowIpaddress },
        // { path: 'editip', component: EditIpaddressComponent },
        { path: 'editip/:id', component: EditIpaddress }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
