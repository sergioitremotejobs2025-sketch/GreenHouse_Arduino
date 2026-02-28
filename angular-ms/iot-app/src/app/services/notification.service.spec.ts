import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        });
        service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call snackBar.open on notify', () => {
        service.notify('Test message', 'success');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test message', 'Cerrar', jasmine.any(Object));
    });

    it('should call notify on notifyAlert', () => {
        const spy = spyOn(service, 'notify').and.callThrough();
        service.notifyAlert('Temp', 30, 'C', 25, true);
        expect(spy).toHaveBeenCalledWith(
            'ALERTA: Temp (30C) es superior al umbral de 25C',
            'warning'
        );
        expect(snackBarSpy.open).toHaveBeenCalled();
    });
});
