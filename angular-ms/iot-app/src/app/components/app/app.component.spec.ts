import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatModule } from '@modules/mat.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let mediaMatcherMock: any;

  beforeEach(async(() => {
    mediaMatcherMock = {
      matchMedia: jasmine.createSpy('matchMedia').and.returnValue({
        matches: false,
        addListener: () => { },
        removeListener: () => { }
      })
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatModule,
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: MediaMatcher, useValue: mediaMatcherMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should toggle opened state', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.opened = false;
    app.toggle(true);
    expect(app.opened).toBeTrue();
  });

  it('should handle ngOnDestroy', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app.mobileQuery, 'removeListener');
    app.ngOnDestroy();
    expect(app.mobileQuery.removeListener).toHaveBeenCalled();
  });
});
