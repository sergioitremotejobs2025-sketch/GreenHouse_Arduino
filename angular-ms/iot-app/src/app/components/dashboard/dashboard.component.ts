import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, UrlSegment } from '@angular/router'

import { ArduinoService } from '@services/arduino.service'
import { AuthService } from '@services/auth.service'

import { Microcontroller } from '@models/microcontroller.model'

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.component.less'],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  microcontrollers: Microcontroller[] = []
  measure: String
  recentValuesMap: Map<string, number[]> = new Map()

  constructor(
    private route: ActivatedRoute,
    private arduinoService: ArduinoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.url
      .subscribe((url: UrlSegment[]) => {
        this.measure = url[1]?.path

        this.arduinoService.getMicrocontrollers()
          .subscribe(
            (response: Microcontroller[]) => {
              this.microcontrollers = response
              this.microcontrollers.forEach((micro: Microcontroller) => {
                micro.isInactive = false
              })

              if (this.measure) {
                this.microcontrollers = this.microcontrollers.filter((micro: Microcontroller) => {
                  return micro.measure === this.measure
                })
              }

              this.microcontrollers.forEach(micro => {
                if (micro.measure !== 'pictures') {
                  this.seedRecentValues(micro)
                }
              })
            },
            () => this.authService.removeTokens()
          )
      })
  }

  seedRecentValues(micro: Microcontroller) {
    // Get last 20 records. pluralize the measure for the history path
    const plural = micro.measure === 'light' ? 'lights' : micro.measure === 'temperature' ? 'temperatures' : 'humidities'
    this.arduinoService.getPreviousMeasures(micro.ip, micro.measure, plural, undefined, undefined, 20)
      .subscribe((history: any[]) => {
        const key = `${micro.ip}_${micro.measure}`
        // History is returned newest-first due to sort({timestamp:-1}). 
        // LSTM expects chronological oldest -> newest.
        const values = history.reverse().map(h => h.real_value)
        this.recentValuesMap.set(key, values)
      })
  }

  changeActivity(micro: Microcontroller) {
    const idx = this.microcontrollers.findIndex(m => m.ip === micro.ip && m.measure === micro.measure)
    if (idx !== -1) {
      this.microcontrollers[idx] = micro
    }
  }

  updateRecentValues(micro: Microcontroller, measure: any) {
    const key = `${micro.ip}_${micro.measure}`
    const values = this.recentValuesMap.get(key) || []
    values.push(measure.real_value)
    if (values.length > 20) values.shift()
    this.recentValuesMap.set(key, values)
  }

  getRecentValues(micro: Microcontroller): number[] {
    return this.recentValuesMap.get(`${micro.ip}_${micro.measure}`) || []
  }

}
