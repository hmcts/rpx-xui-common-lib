import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CoverageDemoComponent } from './coverage-demo/coverage-demo.component';
import { InvitationDemoComponent } from './coverage-demo/invitation-demo.component';
import { FormControlsDemoComponent } from './coverage-demo/form-controls-demo.component';
import { ServiceSelectionDemoComponent } from './coverage-demo/service-selection-demo.component';
import { CaseSharingDemoComponent, CaseSharingEditDemoComponent, CaseSharingConfirmDemoComponent } from './coverage-demo/case-sharing-demo.component';
import { AddressDemoComponent } from './coverage-demo/address-demo.component';
import { UserManagementDemoComponent } from './coverage-demo/user-management-demo.component';

const routes: Routes = [
  { path: 'coverage/invitation', component: InvitationDemoComponent },
  { path: 'coverage/form-controls', component: FormControlsDemoComponent },
  { path: 'coverage/service-selection', component: ServiceSelectionDemoComponent },
  {
    path: 'coverage/case-sharing', component: CaseSharingDemoComponent, children: [
      { path: 'confirmation', component: CaseSharingConfirmDemoComponent },
      { path: '', component: CaseSharingEditDemoComponent }
    ]
  },
  { path: 'coverage/address', component: AddressDemoComponent },
  { path: 'coverage/users', component: UserManagementDemoComponent, children: [{ path: ':id', children: [] }] },
  {
    path: 'coverage',
    component: CoverageDemoComponent
  },
  {
    path: 'home',
    component: AppComponent
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
