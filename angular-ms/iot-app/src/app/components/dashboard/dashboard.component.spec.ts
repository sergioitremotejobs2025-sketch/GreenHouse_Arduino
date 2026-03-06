import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { TestModule } from '@modules/test.module';
import { of, throwError } from 'rxjs';
import { UrlSegment, ActivatedRoute } from '@angular/router';
import { ArduinoService } from '@services/arduino.service';
import { AuthService } from '@services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let arduinoService: jasmine.SpyObj<ArduinoService>;
  let authService: jasmine.SpyObj<AuthService>;
  let urlSubject: BehaviorSubject<UrlSegment[]>;

  beforeEach(async(() => {
    const arduinoSpy = jasmine.createSpyObj('ArduinoService', ['getMicrocontrollers', 'getPreviousMeasures']);
    const authSpy = jasmine.createSpyObj('AuthService', ['removeTokens']);
    urlSubject = new BehaviorSubject<UrlSegment[]>([]);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        TestModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ArduinoService, useValue: arduinoSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: { url: urlSubject.asObservable() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    arduinoService = TestBed.inject(ArduinoService) as jasmine.SpyObj<ArduinoService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    arduinoService.getMicrocontrollers.and.returnValue(of([]));
    arduinoService.getPreviousMeasures.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should filter microcontrollers by measure from URL', () => {
    const mockMicros = [
      { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice' },
      { ip: '2.2.2.2', measure: 'temperature', sensor: 'DHT11', username: 'alice' }
    ];
    arduinoService.getMicrocontrollers.and.returnValue(of(mockMicros as any));
    arduinoService.getPreviousMeasures.and.returnValue(of([]));

    fixture.detectChanges();
    expect(component.microcontrollers.length).toBe(2);

    // Simulate route change to 'humidity'
    urlSubject.next([
      new UrlSegment('measure', {}),
      new UrlSegment('humidity', {})
    ]);

    expect(component.measure).toBe('humidity');
    expect(component.microcontrollers.length).toBe(1);
    expect(component.microcontrollers[0].measure).toBe('humidity');
  });

  it('should call removeTokens on error', () => {
    arduinoService.getMicrocontrollers.and.returnValue(throwError('Error'));
    arduinoService.getPreviousMeasures.and.returnValue(of([]));
    fixture.detectChanges();
    expect(authService.removeTokens).toHaveBeenCalled();
  });

  it('should update microcontroller in changeActivity', () => {
    const micro = { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice', isInactive: false };
    component.microcontrollers = [micro];
    const updatedMicro = { ...micro, isInactive: true };
    component.changeActivity(updatedMicro);
    expect(component.microcontrollers[0].isInactive).toBe(true);
  });

  it('should seed recent values with different measures', () => {
    const mockMicros = [
      { ip: '1.2.3.4', measure: 'light', sensor: 'LDR', username: 'u' },
      { ip: '1.2.3.5', measure: 'temperature', sensor: 'DHT', username: 'u' },
      { ip: '1.2.3.6', measure: 'humidity', sensor: 'DHT', username: 'u' }
    ];
    arduinoService.getMicrocontrollers.and.returnValue(of(mockMicros as any));
    arduinoService.getPreviousMeasures.and.returnValue(of([{ real_value: 10 }] as any));

    fixture.detectChanges();

    expect(arduinoService.getPreviousMeasures).toHaveBeenCalledWith('1.2.3.4', 'light', 'lights', undefined, undefined, 20);
    expect(component.getRecentValues(mockMicros[0] as any)).toEqual([10]);
  });

  it('should handle updateRecentValues and sliding window', () => {
    const micro = { ip: 'i', measure: 'm' };
    const key = 'i_m';

    // Initial update
    component.updateRecentValues(micro as any, { real_value: 5 });
    expect(component.getRecentValues(micro as any)).toEqual([5]);

    // Fill to > 20
    for (let i = 0; i < 25; i++) {
      component.updateRecentValues(micro as any, { real_value: i });
    }
    const values = component.getRecentValues(micro as any);
    expect(values.length).toBe(20);
    expect(values[19]).toBe(24);
  });

  it('should handle getRecentValues with missing key', () => {
    const micro = { ip: 'missing', measure: 'none' };
    expect(component.getRecentValues(micro as any)).toEqual([]);
  });
});
