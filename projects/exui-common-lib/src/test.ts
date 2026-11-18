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

// Keep the existing Zone.js test semantics when TestBed defaults to zoneless in Angular 21.
@NgModule({ providers: [provideZoneChangeDetection()] })
class ZoneTestModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule, ZoneTestModule],
  platformBrowserDynamicTesting()
);
