import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { forkJoin, of } from 'rxjs';

import { GoogleChartInterface } from 'ng2-google-charts'

import { ArduinoService } from '@services/arduino.service'

import { HumidityStats } from '@models/humidity-stats.model'
import { LightStats } from '@models/light-stats.model'
import { Microcontroller } from '@models/microcontroller.model'
import { TemperatureStats } from '@models/temperature-stats.model'

import { MustBeOrderedDates } from '@helpers/must-be-ordered-dates.helper'

import { MeasureViewPipe } from '@pipes/measure-view.pipe'

interface Stat {
  color: string
  isSelected: boolean
  name: string
  value: string
}

@Component({
  selector: 'app-measure-history',
  styleUrls: ['./measure-history.component.less'],
  templateUrl: './measure-history.component.html'
})
export class MeasureHistoryComponent implements OnInit {

  header: string[]
  options: any = {
    colors: ['#3f51b5', '#e91e63', '#ffc107'],
    hAxis: {
      gridlines: { units: { days: { format: ['dd MMM'] }, hours: { format: ["HH 'h'"] } } },
      minorGridlines: { units: { hours: { format: ["HH 'h'"] } } },
      textStyle: { color: 'rgba(255,255,255,0.7)' }
    },
    vAxis: {
      textStyle: { color: 'rgba(255,255,255,0.7)' },
      gridlines: { color: 'rgba(255,255,255,0.1)' }
    },
    legend: {
      alignment: 'end',
      position: 'top',
      textStyle: { color: 'rgba(255,255,255,0.9)' }
    },
    backgroundColor: 'transparent',
    chartArea: { width: '85%', height: '70%', top: 50 },
    explorer: {
      actions: ['dragToZoom', 'rightClickToReset'],
      axis: 'horizontal',
      keepInBounds: true,
      maxZoomIn: 4.0
    },
    curveType: 'function'
  }
  chart: GoogleChartInterface = {
    chartType: 'LineChart',
    dataTable: [],
    options: this.options
  }
  data: any[] = []
  micro: Microcontroller
  historyForm: FormGroup
  stat = 'Media'
  stats: Stat[] = [
    { color: '#3f51b5', isSelected: false, name: 'Mínimo', value: 'min_value' },
    { color: '#4caf50', isSelected: true, name: 'Media', value: 'mean_value' },
    { color: '#f44336', isSelected: false, name: 'Máximo', value: 'max_value' }
  ]
  currentStats: string[] = ['mean_value']
  isComparing = false

  constructor(
    private route: ActivatedRoute,
    private arduinoService: ArduinoService,
    private formBuilder: FormBuilder
  ) {
    this.historyForm = this.formBuilder.group(
      {
        init_date: [new Date(Date.now() - 24 * 60 * 60 * 1000), Validators.required],
        end_date: [new Date(), Validators.required],
        compare_init_date: [new Date(Date.now() - 48 * 60 * 60 * 1000)],
        compare_end_date: [new Date(Date.now() - 24 * 60 * 60 * 1000)],
        stats: ['Mean']
      },
      {
        validator: MustBeOrderedDates('init_date', 'end_date')
      }
    )
  }

  async ngOnInit() {
    const ip = this.route.snapshot.paramMap.get('ip')
    const measure = this.route.snapshot.paramMap.get('measure')

    try {
      this.micro = await this.arduinoService.getMicrocontroller(ip, measure)
      this.header = ['Tiempo', new MeasureViewPipe().transform(this.micro.measure)]
      this.chart.dataTable = [this.header, [new Date(), 0]]
    } catch (error) { }
  }

  selectChanged() {
    for (const stat of this.stats) {
      stat.isSelected = this.currentStats.indexOf(stat.value) !== -1
    }

    this.drawChart(this.data)
  }

  isOptionDisabled(micro: Microcontroller, stat: Stat): boolean {
    if (micro.measure === 'light' && stat.name !== 'Mean') return true
    return this.stats.filter(stat => stat.isSelected).length === 1 && stat.isSelected
  }

  getPreviousMeasures(formValue: any) {
    const { init_date, end_date, compare_init_date, compare_end_date } = formValue;

    const obs1 = this.arduinoService.getPreviousMeasures(
      this.micro.ip,
      this.micro.measure,
      this.makePlural(this.micro.measure),
      init_date.toJSON(),
      end_date.toJSON()
    );

    const obs2 = this.isComparing ? this.arduinoService.getPreviousMeasures(
      this.micro.ip,
      this.micro.measure,
      this.makePlural(this.micro.measure),
      compare_init_date.toJSON(),
      compare_end_date.toJSON()
    ) : of(null);

    forkJoin([obs1, obs2]).subscribe(([measures1, measures2]) => {
      this.data = measures1;
      this.drawChart(measures1, measures2);
    });
  }

  makePlural(word: string) {
    const lastLetterIndex = word.length - 1
    return word[lastLetterIndex] !== 'y' ? `${word}s` : `${word.substring(0, lastLetterIndex)}ies`
  }

  drawChart(measures: any[], compareMeasures: any[] = null) {
    if (measures && measures.length) {
      const stats = this.stats.filter(stat => stat.isSelected)
      const names = stats.map(stat => stat.name)

      if (this.isComparing && compareMeasures) {
        this.chart.dataTable = [['Punto', ...names.map(n => n + ' (P1)'), ...names.map(n => n + ' (P2)')]];
        this.options.colors = [...stats.map(s => s.color), ...stats.map(s => this.shadeColor(s.color, -30))];

        const count = Math.max(measures.length, compareMeasures.length);
        for (let i = 0; i < count; i++) {
          const row = [i + 1];
          stats.forEach(s => row.push(measures[i] ? measures[i][s.value] : null));
          stats.forEach(s => row.push(compareMeasures[i] ? compareMeasures[i][s.value] : null));
          this.chart.dataTable.push(row);
        }
      } else {
        this.chart.dataTable = [[this.header[0], ...names]]
        this.options.colors = stats.map(stat => stat.color)

        measures.forEach((measure: any) => {
          this.chart.dataTable.push([
            new Date(measure.init_date),
            ...stats.map(stat => measure[stat.value])
          ])
        })
      }

      this.chart.options = { ...this.options };
      if (this.chart.component) this.chart.component.draw()
    } else if (measures) {
      alert('¡No hay datos registrados!')
    }
  }

  shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(((R * (100 + percent)) / 100).toString());
    G = parseInt(((G * (100 + percent)) / 100).toString());
    B = parseInt(((B * (100 + percent)) / 100).toString());

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR = R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    const GG = G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    const BB = B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  }
}
