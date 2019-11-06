import { NgModule } from '@angular/core';
import { windowProvider, windowToken } from './window';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers: [
    { provide: windowToken, useFactory: windowProvider }
  ],
  exports: [
  ]
})
export class ExuiCommonLibModule { }
