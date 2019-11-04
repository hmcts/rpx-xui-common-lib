import { NgModule } from '@angular/core';
import { WindowToken, windowProvider } from './window';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    { provide: WindowToken, useFactory: windowProvider }
  ],
  exports: []
})
export class ExuiCommonLibModule { }
