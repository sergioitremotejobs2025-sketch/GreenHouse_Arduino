import { NgModule, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'google-chart',
  template: '',
  standalone: true
})
export class GoogleChartComponent {
  @Input() data: any;
  @Output() chartReady = new EventEmitter();
  @Output() chartError = new EventEmitter();
}

@NgModule({
  imports: [GoogleChartComponent],
  exports: [GoogleChartComponent]
})
export class Ng2GoogleChartsModule {}
