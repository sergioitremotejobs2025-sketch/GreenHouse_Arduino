import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { ArduinoService } from '@services/arduino.service'
import { SocketService } from '@services/socket.service'
import { NotificationService } from '@services/notification.service'

import { Pictures } from '@models/pictures.model'
import { MeasureChart } from '@shared/measure-chart.class'

@Component({
    selector: 'app-pictures-chart',
    styleUrls: ['./pictures-chart.component.less'],
    templateUrl: './pictures-chart.component.html'
})
export class PicturesChartComponent extends MeasureChart {

    lastPicture: Pictures
    history: Pictures[] = []

    constructor(
        private arduinoService: ArduinoService,
        private router: Router,
        protected override socketService: SocketService,
        protected override notificationService: NotificationService
    ) {
        super('Imágenes', 'Gauge', socketService, notificationService)
    }

    async getCurrentMeasure(isFirstTime: boolean) {
        const picInfo = await this.arduinoService.getCurrentMeasure(this.micro.ip, 'pictures') as Pictures

        if (picInfo) {
            this.lastPicture = picInfo
            if (this.history.length === 0 || this.history[0].timestamp !== picInfo.timestamp) {
                this.history.unshift(picInfo)
                if (this.history.length > 10) this.history.pop()
            }
            this.handleMeasure(picInfo, isFirstTime)
        } else if (!this.micro.isInactive) {
            this.setInactivity(true)
        }
    }

    drawData(pictures: Pictures) {
        this.isChartReady = true
    }

    goToHistory() {
        this.router.navigate(['/dashboard/history-pictures', this.micro.ip])
    }

}
