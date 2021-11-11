import { registerLocaleData } from '@angular/common';
// tslint:disable-next-line:named-imports-order
import { LOCALE_ID } from '@angular/core';
// tslint:disable-next-line:named-imports-order
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginatePipe, PaginationControlsComponent, PaginationControlsDirective, PaginationService } from 'ngx-pagination';
import { PaginationComponent } from './pagination.component';
// tslint:disable-next-line:named-imports-order
import { ComponentTestComponent, overrideTemplate } from './testing/testing-helpers';

import locale from '@angular/common/locales/de';

registerLocaleData(locale);

describe('PaginationComponent:', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaginationControlsComponent,
        PaginationControlsDirective,
        PaginationComponent,
        ComponentTestComponent,
        PaginatePipe
      ],
      providers: [PaginationService, { provide: LOCALE_ID, useValue: 'en_US' }],
    });
  });

  it('should allow multiple independent instances (controller test)', () => {
    overrideTemplate(ComponentTestComponent, `
            <ul class="list1">
               <li *ngFor="let item of collection | paginate: {id: 'test1', itemsPerPage: 10, currentPage: p1 }"
                   class="list-item">{{ item }}</li>
            </ul>
            <xuilib-pagination id="test1"></xuilib-pagination>
            <ul class="list2">
               <li *ngFor="let item of collection | paginate: {id: 'test2', itemsPerPage: 10, currentPage: p2 }"
                   class="list-item">{{ item }}</li>
            </ul>
            <xuilib-pagination id="test2"></xuilib-pagination>`);

    const fixture = TestBed.createComponent(ComponentTestComponent);
    const instance = fixture.componentInstance;
    (instance as any).p1 = 1;
    (instance as any).p2 = 1;

    fixture.detectChanges();

    const controls: PaginationControlsDirective[] = fixture
      .debugElement.queryAll(By.css('pagination-template'))
      .map(el => el.references['p']);

    expect(controls[0].getCurrent()).toBe(1);
    expect(controls[1].getCurrent()).toBe(1);

    (instance as any).p1 = 2;
    fixture.detectChanges();

    expect(controls[0].getCurrent()).toBe(2);
    expect(controls[1].getCurrent()).toBe(1);
  });

  it('"autoHide" should be boolean', () => {
    const fixture = TestBed.createComponent(ComponentTestComponent);
    const controlsInstance = fixture.debugElement.query(By.css('xuilib-pagination')).componentInstance;
    expect(controlsInstance.autoHide).toBe(false);
  });

  it('"responsive" should work with non-data-bound values', () => {
    overrideTemplate(ComponentTestComponent, `
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>
            <xuilib-pagination responsive="true" [id]="config.id"></xuilib-pagination>`);
    const fixture = TestBed.createComponent(ComponentTestComponent);
    fixture.detectChanges();
    const controlsCmp: PaginationControlsComponent = fixture.debugElement
      .query(By.css('xuilib-pagination')).componentInstance;

    expect(controlsCmp.responsive).toBe(true);
  });

});
