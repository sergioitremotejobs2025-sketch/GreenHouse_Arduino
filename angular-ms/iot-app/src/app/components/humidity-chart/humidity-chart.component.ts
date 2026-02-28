import { Component } from '@angular/core'

import { ArduinoService } from '@services/arduino.service'
import { SocketService } from '@services/socket.service'
import { NotificationService } from '@services/notification.service'

import { Humidity } from '@models/humidity.model'
import { MeasureChart } from '@shared/measure-chart.class'

@Component({
  selector: 'app-humidity-chart',
  styleUrls: ['./humidity-chart.component.less'],
  templateUrl: './humidity-chart.component.html'
})
export class HumidityChartComponent extends MeasureChart {

  lastHumidity = -1
  displayedColumns: string[] = ['status', 'min', 'max']
  dataSource: { status: string, min: number, max: number }[] = [
    { status: 'Seco', min: 0.0, max: 31.6 },
    { status: 'Húmedo', min: 31.6, max: 73.7 },
    { status: 'Mojado', min: 73.7, max: 100.0 }
  ]

  constructor(
    private arduinoService: ArduinoService,
    protected override socketService: SocketService,
    protected override notificationService: NotificationService
  ) {
    super('Humedad', 'Gauge', socketService, notificationService)
  }

  async getCurrentMeasure(isFirstTime: boolean) {
    const humidity = await this.arduinoService.getCurrentMeasure(this.micro.ip, this.micro.measure) as Humidity

    if (humidity) {
      this.handleMeasure(humidity, isFirstTime)
    } else if (!this.micro.isInactive) {
      this.setInactivity(true)
    }
  }

  drawData(humidity: Humidity) {
    this.lastHumidity = humidity.real_value
    if (this.chart.dataTable.length === 2) {
      this.chart.dataTable.pop()
    }

    this.chart.dataTable.push([new Date(humidity.date).toLocaleTimeString(), humidity.real_value])
    this.chart.component?.draw()
  }

}
