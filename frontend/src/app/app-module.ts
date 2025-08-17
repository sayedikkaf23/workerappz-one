import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CardActions } from './card-actions/card-actions';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Adminsidebar } from './adminsidebar/adminsidebar';
import { Topbar } from './topbar/topbar';
import { Profile } from './profile/profile';
import { Userrole } from './userrole/userrole';
import { Roles } from './roles/roles';
import { User } from './user/user';
import { Users } from './users/users';
import { Partnercode } from './partnercode/partnercode';
import { AddPartnercode } from './add-partnercode/add-partnercode';
import { EditPartnercode } from './edit-partnercode/edit-partnercode';
import { Transferfund } from './transferfund/transferfund';
import { Admincategory } from './admincategory/admincategory';
import { Adminwallet } from './adminwallet/adminwallet';
import { Admincard } from './admincard/admincard';
import { Transferhistory } from './transferhistory/transferhistory';
import { Spinner } from './spinner/spinner';
import { BusinessUser } from './business-user/business-user';
import { AddCategoryModal } from './add-category-modal/add-category-modal';
import { ViewBusinessUserModal } from './view-business-user-modal/view-business-user-modal';
import { UserEdit } from './user-edit/user-edit';
import { MasterTransfer } from './master-transfer/master-transfer';
import { Edituser } from './edituser/edituser';
import { AddIpaddress } from './add-ipaddress/add-ipaddress';
import { ShowIpaddress } from './show-ipaddress/show-ipaddress';
import { EditIpaddress } from './edit-ipaddress/edit-ipaddress';
import { ViewRole } from './view-role/view-role';
import { PrefundTransfer } from './prefund-transfer/prefund-transfer';
import { Topup } from './topup/topup';
import { Dashboards } from './dashboards/dashboards';
import { PieChart } from './pie-chart/pie-chart';
import { Loader } from './loader/loader';
// import { Sidebar } from './sidebar/sidebar';
import { AdminLogin } from './admin-login/admin-login';
import { PersonalBank } from './personal-bank/personal-bank';
import { PersonalReviewOrder } from './personal-review-order/personal-review-order';
import { AddAdmin } from './add-admin/add-admin';
import { ServiceForm } from './service-form/service-form';
import { ViewService } from './view-service/view-service';
import { MasterGlobalCreditLimit } from './master-global-credit-limit/master-global-credit-limit';
import { MasterGlobalTransactionLimit } from './master-global-transaction-limit/master-global-transaction-limit';
import { CurrencyManagement } from './currency-management/currency-management';
import { AddCurrencyModal } from './add-currency-modal/add-currency-modal';
import { CountryManagement } from './country-management/country-management';
import { AddCountry } from './add-country/add-country';
import { UpdateCountry } from './update-country/update-country';
import { CommonModule, DatePipe } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    Payment,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Home,
    KycApproved,
    CardActions,
    AdminDashboard,
    Adminsidebar,
    Topbar,
    Profile,
    Userrole,
    Roles,
    User,
    Users,
    Partnercode,
    AddPartnercode,
    EditPartnercode,
    Transferfund,
    Admincategory,
    Adminwallet,
    Admincard,
    Transferhistory,
    Spinner,
    BusinessUser,
    AddCategoryModal,
    ViewBusinessUserModal,
    UserEdit,
    MasterTransfer,
    Edituser,
    AddIpaddress,
    ShowIpaddress,
    EditIpaddress,
    ViewRole,
    PrefundTransfer,
    Topup,
    Dashboards,
    PieChart,
    Loader,
    //  Sidebar,
    AdminLogin,
    PersonalBank,
    PersonalReviewOrder,
    AddAdmin,
    ServiceForm,
    ViewService,
    Users,
    MasterGlobalCreditLimit,
    MasterGlobalTransactionLimit,
    CurrencyManagement,
    AddCurrencyModal,
    CountryManagement,
    AddCountry,
    UpdateCountry
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    // MasterGlobalTransactionLimit // Import here instead of declaring it

  ],
  providers: [provideBrowserGlobalErrorListeners(),  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
],
  bootstrap: [App],
})
export class AppModule {}
