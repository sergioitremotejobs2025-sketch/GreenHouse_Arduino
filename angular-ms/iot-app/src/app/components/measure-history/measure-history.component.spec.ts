import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import '@analogjs/vitest-angular/setup-zone';

try {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
} catch (e) {}

import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MeasureHistoryComponent } from './measure-history.component';
import { ArduinoService } from '@services/arduino.service';
import { TestModule } from '@modules/test.module';
import { vi } from 'vitest';

describe('MeasureHistoryComponent', () => {
  let component: MeasureHistoryComponent;
  let fixture: ComponentFixture<MeasureHistoryComponent>;
  let arduinoService: jasmine.SpyObj<ArduinoService>;
  let route: any;

  beforeEach(async(() => {
    const arduinoSpy = jasmine.createSpyObj('ArduinoService', ['getMicrocontroller', 'getPreviousMeasures']);
    route = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.callFake((key: string) => {
            if (key === 'ip') return '1.1.1.1';
            if (key === 'measure') return 'humidity';
            return null;
          })
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [MeasureHistoryComponent],
      imports: [
        TestModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ArduinoService, useValue: arduinoSpy },
        { provide: ActivatedRoute, useValue: route }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    arduinoService = TestBed.inject(ArduinoService) as jasmine.SpyObj<ArduinoService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureHistoryComponent);
    component = fixture.componentInstance;
    spyOn(window, 'alert');
  });

  it('should create and load microcontroller', async () => {
    const mockMicro = { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice' };
    arduinoService.getMicrocontroller.and.returnValue(Promise.resolve(mockMicro));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component).toBeTruthy();
    expect(component.micro()).toEqual(mockMicro);
    expect(component.header).toEqual(['Tiempo', 'Humedad']);
  });

  it('should handle pluralization', () => {
    expect(component.makePlural('humidity')).toBe('humidities');
    expect(component.makePlural('temperature')).toBe('temperatures');
  });

  it('should fetch previous measures', async () => {
    const mockMicro = { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice' };
    arduinoService.getMicrocontroller.and.returnValue(Promise.resolve(mockMicro));
    arduinoService.getPreviousMeasures.and.returnValue(of([{ init_date: new Date().toISOString(), mean_value: 50 }] as any));

    fixture.detectChanges();
    await fixture.whenStable();

    component.getPreviousMeasures(component.historyForm.value);

    expect(arduinoService.getPreviousMeasures).toHaveBeenCalled();
    expect(component.data().length).toBe(1);
    expect(component.chart.dataTable.length).toBeGreaterThan(1);
  });

  it('should shade color', () => {
    const result = component.shadeColor('#3f51b5', -30);
    expect(result).toBeDefined();
    expect(result.startsWith('#')).toBeTrue();
  });

  it('should handle empty data alert', async () => {
    const mockMicro = { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice' };
    arduinoService.getMicrocontroller.and.returnValue(Promise.resolve(mockMicro));
    arduinoService.getPreviousMeasures.and.returnValue(of([]));

    fixture.detectChanges();
    await fixture.whenStable();

    component.getPreviousMeasures(component.historyForm.value);
    expect(window.alert).toHaveBeenCalledWith('¡No hay datos registrados!');
  });

  it('should handle selectChanged', () => {
    spyOn(component, 'drawChart');
    component.currentStats = ['min_value', 'max_value'];
    component.selectChanged();

    for (const stat of component.stats) {
      if (['min_value', 'max_value'].includes(stat.value)) {
        expect(stat.isSelected).toBeTrue();
      } else {
        expect(stat.isSelected).toBeFalse();
      }
    }
    expect(component.drawChart).toHaveBeenCalledWith(component.data());
  });

  it('should handle isOptionDisabled', () => {
    const mockMicroLight = { ip: '1', measure: 'light', sensor: 'l', username: 'x' };
    expect(component.isOptionDisabled(mockMicroLight as any, { name: 'Mínimo' } as any)).toBeTrue();
    expect(component.isOptionDisabled(mockMicroLight as any, { name: 'Mean', isSelected: false } as any)).toBeFalse();

    const mockMicroTemp = { ip: '1', measure: 'temperature', sensor: 't', username: 'x' };
    component.stats = [{ isSelected: true, value: 'v1' } as any, { isSelected: false, value: 'v2' } as any];
    expect(component.isOptionDisabled(mockMicroTemp as any, component.stats[0])).toBeTrue();
  });

  it('should fetch previous measures and comparing measures', async () => {
    const mockMicro = { ip: '1.1.1.1', measure: 'humidity', sensor: 'DHT11', username: 'alice' };
    arduinoService.getMicrocontroller.and.returnValue(Promise.resolve(mockMicro));
    arduinoService.getPreviousMeasures.and.returnValue(of([{ init_date: new Date().toISOString(), mean_value: 50 }] as any));

    fixture.detectChanges();
    await fixture.whenStable();

    component.isComparing = true;
    component.getPreviousMeasures(component.historyForm.value);

    expect(arduinoService.getPreviousMeasures).toHaveBeenCalledTimes(2);
    expect(component.data().length).toBe(1);
    expect(component.chart.dataTable.length).toBeGreaterThan(1);
  });

  it('should handle ngOnInit error', async () => {
    arduinoService.getMicrocontroller.and.returnValue(Promise.reject('error'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.micro()).toBeUndefined();
  });

  it('should handle shadeColor with high/low values', () => {
    const darkColor = '#010101';
    const darkShaded = component.shadeColor(darkColor, 10);
    expect(darkShaded).toBe('#010101');
    expect(component.shadeColor('#000000', 10)).toBe('#000000');
    const lightColor = '#ffffff';
    const lighter = component.shadeColor(lightColor, 10);
    expect(lighter).toBe('#ffffff');
  });

  it('should handle chart.component.draw if exists', () => {
    const drawSpy = jasmine.createSpy('draw');
    component.header = ['Time', 'Value'];
    component.chart.dataTable = [];
    component.chart.component = { draw: drawSpy } as any;
    const measures = [{ init_date: new Date().toISOString(), mean_value: 50 }];
    component.drawChart(measures);
    expect(drawSpy).toHaveBeenCalled();
  });

  it('should handle mismatched array lengths in comparison mode', () => {
    component.isComparing = true;
    component.stats = [{ isSelected: true, value: 'mean_value', name: 'Mean', color: '#fff' }];
    const measures1 = [{ mean_value: 50 }];
    const measures2 = [{ mean_value: 60 }, { mean_value: 70 }];

    component.drawChart(measures1, measures2);

    expect(component.chart.dataTable.length).toBe(3);
    expect(component.chart.dataTable[2][1]).toBeNull();
    expect(component.chart.dataTable[1][2]).toBe(60);
  });

  it('should handle mismatched array lengths in comparison mode (measures1 longer)', () => {
    component.isComparing = true;
    component.stats = [{ isSelected: true, value: 'mean_value', name: 'Mean', color: '#fff' }];
    const measures1 = [{ mean_value: 50 }, { mean_value: 60 }];
    const measures2 = [{ mean_value: 70 }];

    component.drawChart(measures1, measures2);

    expect(component.chart.dataTable.length).toBe(3);
    expect(component.chart.dataTable[2][2]).toBeNull();
  });
});
