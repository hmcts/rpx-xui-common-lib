import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import * as fromComponents from './components';
import * as fromContainers from './containers';
import { reducers } from './store';
import { styleGuideRouting } from './style-guide.routing';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    styleGuideRouting,
    StoreModule.forFeature('style-guide', reducers),
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers,  ...fromComponents.components]
})

/**
 * Entry point to StyleGuideModule
 */

export class StyleGuideModule {}
