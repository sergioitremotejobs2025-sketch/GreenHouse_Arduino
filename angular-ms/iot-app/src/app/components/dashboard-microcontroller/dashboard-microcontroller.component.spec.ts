import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMicrocontrollerComponent } from './dashboard-microcontroller.component';
import { TestModule } from '@modules/test.module';

describe('DashboardMicrocontrollerComponent', () => {
  let component: DashboardMicrocontrollerComponent;
  let fixture: ComponentFixture<DashboardMicrocontrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMicrocontrollerComponent],
      imports: [TestModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMicrocontrollerComponent);
    component = fixture.componentInstance;
    component.micro = {
      ip: '192.168.1.1',
      measure: 'temperature',
      sensor: 'DHT11',
      username: 'alice',
      isInactive: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display sensor and measure', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.sensor-name').textContent).toContain('DHT11');
    expect(compiled.querySelector('.measure-label').textContent).toContain('Temperatura');
  });
});
