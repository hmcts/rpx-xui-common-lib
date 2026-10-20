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
import { AdvancedFilterDemoComponent } from './coverage-demo/advanced-filter-demo.component';
import { LifecycleDemoComponent } from './coverage-demo/lifecycle-demo.component';
import { SearchDemoComponent } from './coverage-demo/search-demo.component';
import { PrimitivesDemoComponent } from './coverage-demo/primitives-demo.component';
import { LookupsDemoComponent } from './coverage-demo/lookups-demo.component';
import { AccessibilityDemoComponent } from './coverage-demo/accessibility-demo.component';
import { StandaloneComponentsDemoComponent } from './coverage-demo/standalone-components-demo.component';
import { ExtendedControlsDemoComponent } from './coverage-demo/extended-controls-demo.component';
import { SelectedCaseDemoComponent } from './coverage-demo/selected-case-demo.component';
import { PublicContractsDemoComponent } from './coverage-demo/public-contracts-demo.component';
import { ValidatorContractsDemoComponent } from './coverage-demo/validator-contracts-demo.component';
import { ServiceContractADemoComponent } from './coverage-demo/service-contract-a-demo.component';
import { ServiceContractBDemoComponent } from './coverage-demo/service-contract-b-demo.component';

const routes: Routes = [
  { path: 'coverage/accessibility/manage-case', component: AccessibilityDemoComponent },
  { path: 'coverage/accessibility', component: AccessibilityDemoComponent },
  { path: 'coverage/standalone', component: StandaloneComponentsDemoComponent },
  { path: 'coverage/extended-controls', component: ExtendedControlsDemoComponent },
  { path: 'coverage/lookups', component: LookupsDemoComponent },
  { path: 'coverage/advanced-filter', component: AdvancedFilterDemoComponent },
  { path: 'coverage/lifecycle', component: LifecycleDemoComponent },
  { path: 'coverage/searches', component: SearchDemoComponent },
  { path: 'coverage/primitives', component: PrimitivesDemoComponent },
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
  { path: 'coverage/selected-cases', component: SelectedCaseDemoComponent },
  { path: 'coverage/public-contracts', component: PublicContractsDemoComponent },
  { path: 'coverage/validators', component: ValidatorContractsDemoComponent },
  { path: 'coverage/service-contract-a', component: ServiceContractADemoComponent },
  { path: 'coverage/service-contract-b', component: ServiceContractBDemoComponent },
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
