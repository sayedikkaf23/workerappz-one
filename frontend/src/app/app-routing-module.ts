import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login', // Redirect to /login by default
    pathMatch: 'full' // Ensures exact match with the root path
  },
  { path: 'login', component: Login }, // Explicitly route for /login
  { path: 'register', component: Register }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
