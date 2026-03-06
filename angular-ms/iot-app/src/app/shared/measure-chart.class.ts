import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { Subscription } from 'rxjs';

import { GoogleChartInterface } from 'ng2-google-charts'

import { Microcontroller } from '@models/microcontroller.model'
import { Measure } from '@alias/measure.type'
import { SocketService } from '@services/socket.service';
import { NotificationService } from '@services/notification.service';

@Directive()
export abstract class MeasureChart implements OnDestroy, OnInit {

  @Input() micro: Microcontroller
  @Output() inactivity = new EventEmitter<Microcontroller>()
  @Output() measure = new EventEmitter<Measure>()

  chart: GoogleChartInterface
  header: string[]
  interval: NodeJS.Timeout
  isChartReady = false
  refresh_time = 30000 // Poll less frequently when WebSockets are available

  private socketSubscription: Subscription;

  constructor(
    measure: string,
    chartType: string,
    protected socketService?: SocketService,
    protected notificationService?: NotificationService
  ) {
    this.header = ['Tiempo', measure]
    this.chart = { chartType, dataTable: [this.header] }
  }

  checkInactivity() {
    if (this.micro && this.micro.isInactive) {
      this.setInactivity(false)
    }
  }

  checkThresholds(value: number) {
    if (!this.micro || !this.notificationService) return;

    const unit = this.micro.measure === 'temperature' ? '°C' : this.micro.measure === 'humidity' ? '%' : '';
    const label = this.micro.measure === 'temperature' ? 'Temperatura' : this.micro.measure === 'humidity' ? 'Humedad' : this.micro.measure;

    if (this.micro.thresholdMax !== undefined && value > this.micro.thresholdMax) {
      this.notificationService.notifyAlert(label, value, unit, this.micro.thresholdMax, true);
    } else if (this.micro.thresholdMin !== undefined && value < this.micro.thresholdMin) {
      this.notificationService.notifyAlert(label, value, unit, this.micro.thresholdMin, false);
    }
  }

  abstract drawData(measure: Measure): void

  abstract getCurrentMeasure(isFirstTime: boolean): Promise<void>

  handleMeasure(measure: Measure, isFirstTime: boolean) {
    this.drawData(measure)
    this.measure.emit(measure)

    // Check thresholds if it's a numeric value
    const numericValue = (measure as any).real_value ?? (measure as any).digital_value;
    if (typeof numericValue === 'number') {
      this.checkThresholds(numericValue);
    }

    if (isFirstTime) {
      this.interval = setInterval(() => this.getCurrentMeasure(false), this.refresh_time)
      this.isChartReady = true

      // Subscribe to real-time updates if socket service is available
      if (this.socketService) {
        this.socketSubscription = this.socketService.measureUpdate$.subscribe(update => {
          if (update.measure === this.micro.measure && update.data.ip === this.micro.ip) {
            console.log(`Real-time update received for ${this.micro.measure} at ${this.micro.ip}`);
            this.handleMeasure(update.data, false);
          }
        });
      }
    } else {
      this.checkInactivity()
    }
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval)
    if (this.socketSubscription) this.socketSubscription.unsubscribe();
  }

  async ngOnInit() {
    await this.getCurrentMeasure(true)
  }

  setInactivity(isInactive: boolean): void {
    if (this.micro) {
      this.micro.isInactive = isInactive
      this.inactivity.emit(this.micro)
    }
  }

}
