import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { LoginComponent } from '@components/login/login.component';
import { TestModule } from '@modules/test.module';
import { ThemeService } from '@services/theme.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        NavbarComponent
      ],
      imports: [TestModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle and emit', () => {
    spyOn(component.opened, 'emit');
    component.toggle();
    expect(component.isOpen).toBeTrue();
    expect(component.opened.emit).toHaveBeenCalledWith(true);

    component.toggle();
    expect(component.isOpen).toBeFalse();
    expect(component.opened.emit).toHaveBeenCalledWith(false);
  });

  it('should toggle theme', () => {
    const themeService = TestBed.inject(ThemeService);
    spyOn(themeService, 'toggleTheme');
    component.toggleTheme();
    expect(themeService.toggleTheme).toHaveBeenCalled();
  });
});
