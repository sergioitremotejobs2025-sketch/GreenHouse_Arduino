import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div class="skeleton-box pulse" 
         [style.width]="width" 
         [style.height]="height" 
         [style.border-radius]="borderRadius">
    </div>
  `,
  styles: [`
    .skeleton-box {
      background-color: rgba(0, 0, 0, 0.08);
      display: inline-block;
    }

    [theme="dark"] .skeleton-box {
      background-color: rgba(255, 255, 255, 0.08);
    }

    .pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  `]
})
export class SkeletonComponent {
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() borderRadius = '4px';
}
