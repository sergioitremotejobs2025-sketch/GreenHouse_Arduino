import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply provided width and height', () => {
    component.width = '200px';
    component.height = '100px';
    fixture.detectChanges();
    
    const element = fixture.nativeElement.querySelector('.skeleton-box');
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('100px');
  });

  it('should have a pulse animation class', () => {
    const element = fixture.nativeElement.querySelector('.skeleton-box');
    expect(element.classList.contains('pulse')).toBeTrue();
  });
});
