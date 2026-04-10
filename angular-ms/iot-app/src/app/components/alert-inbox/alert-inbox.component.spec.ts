import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertInboxComponent } from './alert-inbox.component';
import { AlertHistoryService, AlertEntry } from '../../services/alert-history.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { of } from 'rxjs';

describe('AlertInboxComponent', () => {
    let component: AlertInboxComponent;
    let fixture: ComponentFixture<AlertInboxComponent>;
    let alertHistorySpy: jasmine.SpyObj<AlertHistoryService>;

    const mockHistory: AlertEntry[] = [
        { message: 'Alert 1', type: 'warning', timestamp: new Date() },
        { message: 'Alert 2', type: 'error', timestamp: new Date() }
    ];

    beforeEach(async () => {
        alertHistorySpy = jasmine.createSpyObj('AlertHistoryService', ['getHistory', 'clearHistory']);
        alertHistorySpy.getHistory.and.returnValue(mockHistory);

        await TestBed.configureTestingModule({
            declarations: [AlertInboxComponent],
            imports: [MatMenuModule, MatIconModule, MatListModule],
            providers: [
                { provide: AlertHistoryService, useValue: alertHistorySpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AlertInboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display alerts from history', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const items = compiled.querySelectorAll('mat-list-item');
        expect(items.length).toBe(2);
        expect(items[0].textContent).toContain('Alert 1');
    });

    it('should call clearHistory on service when clear is clicked', () => {
        component.clearHistory();
        expect(alertHistorySpy.clearHistory).toHaveBeenCalled();
    });
});
