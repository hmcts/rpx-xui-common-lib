import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { PaginationV1Component } from './pagination.component';

@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  declarations: [
    PaginationV1Component
  ],
  exports: [
    PaginationV1Component,
    PaginatePipe
  ],
})
export class PaginationModule {}
