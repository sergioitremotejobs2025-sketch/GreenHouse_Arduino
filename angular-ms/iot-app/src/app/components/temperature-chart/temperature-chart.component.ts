import { Component } from '@angular/core'

import { ArduinoService } from '@services/arduino.service'
import { SocketService } from '@services/socket.service'
import { NotificationService } from '@services/notification.service'

import { Temperature } from '@models/temperature.model'
import { MeasureChart } from '@shared/measure-chart.class'

@Component({
  selector: 'app-temperature-chart',
  styleUrls: ['./temperature-chart.component.less'],
  templateUrl: './temperature-chart.component.html'
})
export class TemperatureChartComponent extends MeasureChart {

  H_AXIS_MAX = 10

  constructor(
    private arduinoService: ArduinoService,
    protected override socketService: SocketService,
    protected override notificationService: NotificationService
  ) {
    super('Temperatura', 'AreaChart', socketService, notificationService)
    this.chart.options = {
      hAxis: {
        viewWindow: {
          max: this.H_AXIS_MAX
        }
      },
      legend: {
        alignment: 'end',
        position: 'top'
      }
    }
  }

  async getCurrentMeasure(isFirstTime: boolean) {
    const temperature = await this.arduinoService.getCurrentMeasure(this.micro.ip, this.micro.measure) as Temperature

    if (temperature) {
      this.handleMeasure(temperature, isFirstTime)
    } else if (!this.micro.isInactive) {
      this.setInactivity(true)
    }
  }

  drawData(temperature: Temperature) {
    if (this.chart.dataTable.length === this.H_AXIS_MAX + 1) {
      this.chart.dataTable.shift()
      this.chart.dataTable.shift()
      this.chart.dataTable.unshift(this.header)
    }

    this.chart.dataTable.push([new Date(temperature.date).toLocaleTimeString(), temperature.real_value])
    this.chart.component?.draw()
  }

}
