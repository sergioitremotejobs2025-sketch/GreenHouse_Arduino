import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AiPredictorComponent } from './ai-predictor.component';
import { AiService } from 'src/app/services/ai.service';
import { NotificationService } from 'src/app/services/notification.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AiPredictorComponent', () => {
    let component: AiPredictorComponent;
    let fixture: ComponentFixture<AiPredictorComponent>;
    let mockAiService: jasmine.SpyObj<AiService>;
    let mockNotificationService: jasmine.SpyObj<NotificationService>;

    beforeEach(async () => {
        mockAiService = jasmine.createSpyObj('AiService', ['evaluate', 'trainModel', 'predict']);
        mockNotificationService = jasmine.createSpyObj('NotificationService', ['notify']);

        await TestBed.configureTestingModule({
            declarations: [AiPredictorComponent],
            imports: [FormsModule],
            providers: [
                { provide: AiService, useValue: mockAiService },
                { provide: NotificationService, useValue: mockNotificationService }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AiPredictorComponent);
        component = fixture.componentInstance;
        component.ip = '127.0.0.1';
        component.measure = 'temperature';
        component.recentValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 10 values
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch performance on init and handle success', () => {
        const perfData = { mae: 0.5, sample_count: 100 };
        mockAiService.evaluate.and.returnValue(of(perfData));

        fixture.detectChanges(); // calls ngOnInit

        expect(mockAiService.evaluate).toHaveBeenCalledWith('127.0.0.1', 'temperature');
        expect(component.performance).toEqual(perfData);
    });

    it('should handle fetch performance error on init', () => {
        mockAiService.evaluate.and.returnValue(throwError(() => new Error('error')));

        fixture.detectChanges(); // calls ngOnInit

        expect(component.performance).toBeNull();
    });

    it('should train model and update performance on success', fakeAsync(() => {
        mockAiService.trainModel.and.returnValue(of({} as any));
        mockAiService.evaluate.and.returnValue(of({ mae: 0.1, sample_count: 50 }));

        component.train();
        tick();

        expect(component.training).toBeFalse();
        expect(mockAiService.trainModel).toHaveBeenCalledWith('127.0.0.1', 'temperature', 1000);
        expect(mockNotificationService.notify).toHaveBeenCalledWith('Modelo entrenado con éxito');
        expect(mockAiService.evaluate).toHaveBeenCalled();
        expect(component.performance).toEqual({ mae: 0.1, sample_count: 50 });
    }));

    it('should handle train model error', fakeAsync(() => {
        mockAiService.trainModel.and.returnValue(throwError(() => new Error('error')));

        component.train();
        tick();

        expect(component.training).toBeFalse();
        expect(mockNotificationService.notify).toHaveBeenCalledWith('Error al entrenar el modelo', 'error');
    }));

    it('should not predict if recentValues < 10', () => {
        component.recentValues = [1, 2];
        component.predict();

        expect(mockAiService.predict).not.toHaveBeenCalled();
        expect(mockNotificationService.notify).toHaveBeenCalledWith('Necesitas al menos 10 lecturas recientes', 'warning');
    });

    it('should predict and handle success', fakeAsync(() => {
        mockAiService.predict.and.returnValue(of({ prediction: 25.5 }));

        component.predict();
        tick();

        expect(component.loading).toBeFalse();
        expect(mockAiService.predict).toHaveBeenCalledWith('127.0.0.1', 'temperature', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(component.prediction).toBe(25.5);
    }));

    it('should handle predict error', fakeAsync(() => {
        mockAiService.predict.and.returnValue(throwError(() => new Error('error')));

        component.predict();
        tick();

        expect(component.loading).toBeFalse();
        expect(mockNotificationService.notify).toHaveBeenCalledWith('Modelo no encontrado. ¡Entrénalo primero!', 'error');
    }));
});
