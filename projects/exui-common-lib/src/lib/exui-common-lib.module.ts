import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TcDisplayHtmlComponent } from './components/terms-and-conditions/tc-display/tc-display-html/tc-display-html.component';
import { TcDisplayPlainComponent } from './components/terms-and-conditions/tc-display/tc-display-plain/tc-display-plain.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { windowProvider, windowToken } from './window';

@NgModule({
  declarations: [
    TermsAndConditionsComponent,
    TcDisplayHtmlComponent,
    TcDisplayPlainComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: windowToken, useFactory: windowProvider }
  ],
  exports: [
    TermsAndConditionsComponent
  ]
})
export class ExuiCommonLibModule { }
