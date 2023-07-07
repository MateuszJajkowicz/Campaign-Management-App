import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { EmeraldAccountService } from './services/emerald-account.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let emeraldAccountService: EmeraldAccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: EmeraldAccountService,
          useValue: {
            getEmeraldAccountBalance: jasmine
              .createSpy('getEmeraldAccountBalance')
              .and.returnValue(of(2000)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    emeraldAccountService = TestBed.inject(EmeraldAccountService);
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct emerald account balance', () => {
    fixture.detectChanges();
    const balanceElement: HTMLElement =
      fixture.nativeElement.querySelector('.balance');

    expect(balanceElement.textContent).toContain(
      'Emerald Account Balance: 2000'
    );
    expect(emeraldAccountService.getEmeraldAccountBalance).toHaveBeenCalled();
  });
});
