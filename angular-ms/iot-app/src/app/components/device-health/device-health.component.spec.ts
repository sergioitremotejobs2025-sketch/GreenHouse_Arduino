import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceHealthComponent } from './device-health.component';
import { ArduinoService } from '@services/arduino.service';
import { of } from 'rxjs';
import { MatModule } from '@modules/mat.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DeviceHealthComponent', () => {
  let component: DeviceHealthComponent;
  let fixture: ComponentFixture<DeviceHealthComponent>;
  let arduinoService: jasmine.SpyObj<ArduinoService>;

  beforeEach(async () => {
    const arduinoSpy = jasmine.createSpyObj('ArduinoService', ['getMicrocontrollers']);
    arduinoSpy.getMicrocontrollers.and.returnValue(of([
      { ip: '1.2.3.4', sensor: 'DHT11', measure: 'humidity' }
    ]));

    await TestBed.configureTestingModule({
      declarations: [ DeviceHealthComponent ],
      imports: [ MatModule ],
      providers: [
        { provide: ArduinoService, useValue: arduinoSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceHealthComponent);
    component = fixture.componentInstance;
    arduinoService = TestBed.inject(ArduinoService) as jasmine.SpyObj<ArduinoService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate health stats', () => {
    const micros = [
      { ip: '1.2.3.4', sensor: 'DHT11', measure: 'humidity' }
    ];
    // component logic will add latency/uptime mock for now
    component.calculateHealth(micros as any);
    expect(component.healthData.length).toBe(1);
    expect(component.healthData[0].latency).toBeDefined();
  });
});
