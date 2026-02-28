import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(() => {
        // Clear localStorage to ensure initial theme logic runs
        localStorage.clear();
        // Default mock for matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jasmine.createSpy('matchMedia').and.returnValue({
                matches: false,
                addListener: () => { },
                removeListener: () => { }
            }),
        });

        TestBed.configureTestingModule({});
        service = TestBed.inject(ThemeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should toggle theme from light to dark', () => {
        // Force set to light
        service.setTheme('light');
        service.toggleTheme();
        service.theme$.subscribe(theme => expect(theme).toBe('dark'));
    });

    it('should toggle theme from dark to light', () => {
        service.setTheme('dark');
        service.toggleTheme();
        service.theme$.subscribe(theme => expect(theme).toBe('light'));
    });

    it('should save theme to localStorage', () => {
        service.setTheme('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should apply theme as data-theme attribute', () => {
        service.setTheme('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
});
