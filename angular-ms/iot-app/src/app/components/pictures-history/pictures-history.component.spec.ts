import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PicturesHistoryComponent } from './pictures-history.component';
import { TestModule } from '@modules/test.module';
import { ArduinoService } from '@services/arduino.service';

describe('PicturesHistoryComponent', () => {
    let component: PicturesHistoryComponent;
    let fixture: ComponentFixture<PicturesHistoryComponent>;
    let arduinoService: jasmine.SpyObj<ArduinoService>;
    let route: any;

    beforeEach(async(() => {
        const arduinoSpy = jasmine.createSpyObj('ArduinoService', ['getMicrocontroller', 'getPicturesHistory']);
        route = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get').and.returnValue('1.2.3.4')
                }
            }
        };

        TestBed.configureTestingModule({
            declarations: [PicturesHistoryComponent],
            imports: [TestModule, ReactiveFormsModule],
            providers: [
                { provide: ArduinoService, useValue: arduinoSpy },
                { provide: ActivatedRoute, useValue: route }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();

        arduinoService = TestBed.get(ArduinoService) as jasmine.SpyObj<ArduinoService>;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PicturesHistoryComponent);
        component = fixture.componentInstance;
    });

    it('should create and load microcontroller', async () => {
        arduinoService.getMicrocontroller.and.returnValue(Promise.resolve({ ip: '1.2.3.4', measure: 'pictures' } as any));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component).toBeTruthy();
        expect(component.micro.ip).toBe('1.2.3.4');
    });

    it('should load history and filter pictures', fakeAsync(() => {
        component.micro = { ip: '1.2.3.4' } as any;
        const mockData = [
            { timestamp: 1, url: 'url1', stage: 'seedling' },
            { timestamp: 2, url: 'url2', stage: 'young_plant' }
        ];
        arduinoService.getPicturesHistory.and.returnValue(of(mockData as any));

        component.loadHistory(component.historyForm.value);

        tick();
        expect(component.isLoading).toBeFalse();
        expect(component.pictures.length).toBe(2);

        component.currentStageFilter = 'seedling';
        component.applyFilter();
        expect(component.filteredPictures.length).toBe(1);
    }));

    it('should handle timelapse', fakeAsync(() => {
        component.filteredPictures = [{ timestamp: 1, url: 'url1' }, { timestamp: 2, url: 'url2' }] as any;

        component.toggleTimelapse();
        expect(component.isTimelapsePlaying).toBeTrue();
        expect(component.timelapseIndex).toBe(0);

        tick(500);
        expect(component.timelapseIndex).toBe(1);

        tick(500);
        expect(component.timelapseIndex).toBe(0);

        component.toggleTimelapse();
        expect(component.isTimelapsePlaying).toBeFalse();
    }));

    it('should handle errors in loadHistory', fakeAsync(() => {
        component.micro = { ip: '1.2.3.4' } as any;
        arduinoService.getPicturesHistory.and.returnValue(throwError('error'));

        component.loadHistory(component.historyForm.value);
        tick();

        expect(component.noResults).toBeTrue();
        expect(component.isLoading).toBeFalse();
    }));

    it('should handle catch error in ngOnInit', async () => {
        arduinoService.getMicrocontroller.and.returnValue(Promise.reject('error'));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.micro).toBeUndefined();
    });

    it('should not play timelapse if no pictures', () => {
        component.filteredPictures = [];
        component.isTimelapsePlaying = false;
        component.toggleTimelapse();
        expect(component.isTimelapsePlaying).toBeFalse();
    });

    it('should return correct stage labels', () => {
        expect(component.stageLabel('seedling')).toBe('🌱 Brote');
        expect(component.stageLabel('unknown_stage')).toBe('unknown_stage');
    });
});
