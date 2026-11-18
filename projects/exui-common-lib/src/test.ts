// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js';
import 'zone.js/testing';
// tslint:disable-next-line: ordered-imports
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import 'core-js/es/reflect';

// Match the Zone.js change detection used by consuming applications.
// Angular 21 defaults TestBed to zoneless even when zone.js/testing is loaded.
@NgModule({
  exports: [BrowserDynamicTestingModule],
  providers: [provideZoneChangeDetection()]
})
class ZoneTestingModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  ZoneTestingModule,
  platformBrowserDynamicTesting()
);
