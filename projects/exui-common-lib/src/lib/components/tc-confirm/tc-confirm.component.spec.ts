import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TcConfirmComponent } from './tc-confirm.component';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rpxTranslate' })
class RpxTranslationMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('TcConfirmComponent', () => {
  let component: TcConfirmComponent;
  let fixture: ComponentFixture<TcConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TcConfirmComponent, RpxTranslationMockPipe],
      imports: [RouterTestingModule],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
