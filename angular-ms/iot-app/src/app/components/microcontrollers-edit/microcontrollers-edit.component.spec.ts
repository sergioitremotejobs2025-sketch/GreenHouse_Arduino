import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { MicrocontrollersEditComponent } from './microcontrollers-edit.component';
import { ArduinoService } from '@services/arduino.service';
import { AuthService } from '@services/auth.service';
import { TestModule } from '@modules/test.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MicrocontrollersEditComponent', () => {
  let component: MicrocontrollersEditComponent;
  let fixture: ComponentFixture<MicrocontrollersEditComponent>;
  let arduinoService: jasmine.SpyObj<ArduinoService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: any;

  beforeEach(async(() => {
    const arduinoSpy = jasmine.createSpyObj('ArduinoService', ['getMicrocontroller', 'postMicrocontroller', 'putMicrocontroller', 'clearMicrocontrollers']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    route = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [MicrocontrollersEditComponent],
      imports: [
        TestModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ArduinoService, useValue: arduinoSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    arduinoService = TestBed.inject(ArduinoService) as jasmine.SpyObj<ArduinoService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrocontrollersEditComponent);
    component = fixture.componentInstance;
  });

  it('should create in add mode', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isEdit).toBeFalse();
  });

  it('should handle edit mode', async () => {
    route.snapshot.paramMap.get.and.callFake((key: string) => {
      if (key === 'ip') return '1.1.1.1';
      if (key === 'measure') return 'humidity';
      return null;
    });
    const mockMicro = { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice' };
    arduinoService.getMicrocontroller.and.returnValue(Promise.resolve(mockMicro));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isEdit).toBeTrue();
    expect(component.ipForm.value.ip).toBe('1.1.1.1');
    expect(component.measureForm.value.measure).toBe('humidity');
  });

  it('should submit new microcontroller', () => {
    authService.getUser.and.returnValue('alice');
    arduinoService.postMicrocontroller.and.returnValue(of({}));

    fixture.detectChanges();
    component.submitMicrocontroller('humidity', '1.1.1.1', 'DHT11');

    expect(arduinoService.postMicrocontroller).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/my-microcontrollers']);
  });

  it('should get available sensors', () => {
    const sensors = component.getAvailableSensors('humidity');
    expect(sensors).toContain('Grove - Moisture');
  });

  it('should reset sensors', () => {
    component.sensorForm.setValue({ sensor: 'DHT11' });
    component.resetSensors();
    expect(component.sensorForm.value.sensor).toBeNull();
  });

  it('should get available sensors for empty measure', () => {
    const sensors = component.getAvailableSensors('nonexistent');
    expect(sensors).toEqual([]);
  });

  it('should handle edit mode with thresholds', async () => {
    route.snapshot.paramMap.get.and.callFake((key: string) => {
      if (key === 'ip') return '1.1.1.1';
      if (key === 'measure') return 'temperature';
      return null;
    });
    const mockMicro = { ip: '1.1.1.1', measure: 'temperature', sensor: 'Fake Grove - Temperature', username: 'alice', thresholdMin: 10, thresholdMax: 30 };
    arduinoService.getMicrocontroller.and.returnValue(Promise.resolve(mockMicro));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.thresholdForm.value.thresholdMin).toBe(10);
    expect(component.thresholdForm.value.thresholdMax).toBe(30);
  });

  it('should submit existing microcontroller (edit mode)', () => {
    authService.getUser.and.returnValue('alice');
    arduinoService.putMicrocontroller.and.returnValue(of({}));

    component.isEdit = true;
    route.snapshot.paramMap.get.and.returnValue('1.1.1.1');
    component.thresholdForm.setValue({ thresholdMin: 10, thresholdMax: 30 });

    component.submitMicrocontroller('temperature', '1.1.1.2', 'Fake Grove - Temperature');

    expect(arduinoService.putMicrocontroller).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/my-microcontrollers']);
  });
});
