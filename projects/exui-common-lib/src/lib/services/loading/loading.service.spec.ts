import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { windowToken } from '../../window';
import { LoadingService } from './loading.service';


describe('LoadingService', () => {

  let titleTestBed: Title;
  let windowTestBed: Window;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        LoadingService
      ]
    });

    titleTestBed = TestBed.get(Title);
    windowTestBed = TestBed.get(windowToken);

  });

});
