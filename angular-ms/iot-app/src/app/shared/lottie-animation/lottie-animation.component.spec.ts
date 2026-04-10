import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LottieAnimationComponent } from './lottie-animation.component';
import { LottieModule } from 'ngx-lottie';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LottieAnimationComponent', () => {
  let component: LottieAnimationComponent;
  let fixture: ComponentFixture<LottieAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LottieAnimationComponent ],
      imports: [ 
        // We mock or provide a simple config for ngx-lottie
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LottieAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute path based on animation name', () => {
    component.name = 'syncing';
    expect(component.options.path).toContain('syncing.json');
  });
});
