import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';

const routes: Routes = [
  {
    path: 'home',
    component: AppComponent
  },
  {
    path: 'style-guide',
    loadChildren: '../style-guide/style-guide.module#StyleGuideModule'
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
