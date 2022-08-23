import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RpxTranslationConfig, RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { TcConfirmComponent } from './tc-confirm.component';


describe('TcConfirmComponent', () => {
  let component: TcConfirmComponent;
  let fixture: ComponentFixture<TcConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TcConfirmComponent],
      imports: [RouterTestingModule, RpxTranslationModule.forChild()],
      providers: [
        RpxTranslationConfig, RpxTranslationService
      ]
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
