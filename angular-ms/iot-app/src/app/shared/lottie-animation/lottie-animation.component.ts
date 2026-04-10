import { Component, Input, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-lottie-animation',
  template: `
    <ng-lottie [options]="options" 
               [style.width]="width" 
               [style.height]="height">
    </ng-lottie>
  `
})
export class LottieAnimationComponent implements OnInit {
  @Input() name: string = 'syncing';
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() loop: boolean = true;

  options: AnimationOptions = {
    path: `/assets/animations/${this.name}.json`,
    autoplay: true,
    loop: this.loop
  };

  ngOnInit(): void {
    this.options = {
      ...this.options,
      path: `/assets/animations/${this.name}.json`,
      loop: this.loop
    };
  }
}
