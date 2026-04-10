import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsComponent } from './analytics.component';
import { ArduinoService } from '../../services/arduino.service';
import { of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let arduinoServiceSpy: jasmine.SpyObj<ArduinoService>;

  beforeEach(async () => {
    arduinoServiceSpy = jasmine.createSpyObj('ArduinoService', ['getMicrocontrollers', 'getPreviousMeasures']);
    arduinoServiceSpy.getMicrocontrollers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ AnalyticsComponent ],
      imports: [ MatSelectModule, FormsModule, BrowserAnimationsModule ],
      providers: [
        { provide: ArduinoService, useValue: arduinoServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load microcontrollers on init', () => {
    expect(arduinoServiceSpy.getMicrocontrollers).toHaveBeenCalled();
  });

  it('should toggle selection of a device', () => {
    const dev = { ip: '1.2.3.4', measure: 'temp', name: 'Test' };
    component.toggleDevice(dev as any);
    expect(component.selectedDevices.length).toBe(1);
    component.toggleDevice(dev as any);
    expect(component.selectedDevices.length).toBe(0);
  });
});
