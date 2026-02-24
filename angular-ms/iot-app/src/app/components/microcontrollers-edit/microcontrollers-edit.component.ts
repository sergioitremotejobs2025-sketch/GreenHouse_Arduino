import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { ArduinoService } from '@services/arduino.service'
import { AuthService } from '@services/auth.service'
import { Microcontroller } from '@models/microcontroller.model';

@Component({
  selector: 'app-microcontrollers-edit',
  styleUrls: ['./microcontrollers-edit.component.less'],
  templateUrl: './microcontrollers-edit.component.html'
})
export class MicrocontrollersEditComponent implements OnInit {

  ipForm: FormGroup
  isEdit = true
  lastForm: FormGroup
  measureForm: FormGroup
  sensorForm: FormGroup
  measures: { name: string, view: string }[] = [
    { name: 'humidity', view: 'Humedad' },
    { name: 'light', view: 'Bombilla inteligente' },
    { name: 'temperature', view: 'Temperatura' },
    { name: 'pictures', view: 'Cámara de planta' }
  ]
  sensors: { humidity: string[], light: string[], temperature: string[], pictures: string[] } = {
    humidity: ['Grove - Moisture', 'Fake Grove - Moisture'],
    light: ['Smart LED', 'Fake Smart LED'],
    temperature: ['Grove - Temperature', 'Fake Grove - Temperature'],
    pictures: ['Tomato Plant Camera']
  }

  constructor(
    private arduinoService: ArduinoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ipForm = new FormGroup({ ip: new FormControl('', [Validators.required]) })
    this.lastForm = new FormGroup({})
    this.measureForm = new FormGroup({ measure: new FormControl('', [Validators.required]) })
    this.sensorForm = new FormGroup({ sensor: new FormControl('', [Validators.required]) })
  }

  ngOnInit() {
    const ip = this.route.snapshot.paramMap.get('ip')
    const measure = this.route.snapshot.paramMap.get('measure')

    this.isEdit = !!(ip && measure)

    if (this.isEdit) {
      this.arduinoService.getMicrocontroller(ip, measure)
        .then(micro => {
          this.ipForm.setValue({ ip: micro.ip })

          const measures = this.measures.filter(m => m.name === micro.measure)
          this.measureForm.setValue({ measure: measures[0].name })
          this.sensorForm.setValue({ sensor: micro.sensor })
          this.measureForm.disable()
          this.sensorForm.disable()
        })
    }
  }

  submitMicrocontroller(measure: string, ip: string, sensor: string) {
    const microcontroller: Microcontroller = {
      ip,
      measure,
      sensor,
      username: this.authService.getUser()
    }

    if (this.isEdit) {
      microcontroller['old_ip'] = this.route.snapshot.paramMap.get('ip')
      this.arduinoService.putMicrocontroller(microcontroller)
        .subscribe(() => {
          this.arduinoService.clearMicrocontrollers()
          this.router.navigate(['/my-microcontrollers'])
        })
    } else {
      this.arduinoService.postMicrocontroller(microcontroller)
        .subscribe(() => {
          this.arduinoService.clearMicrocontrollers()
          this.router.navigate(['/my-microcontrollers'])
        })
    }
  }

  getAvailableSensors(measure: string): string[] {
    const measures = this.measures.filter(m => m.name === measure)
    if (!measures.length) return []
    return this.sensors[measures[0].name]
  }

  resetSensors() {
    this.sensorForm.reset()
    this.sensorForm.markAsPending()
    this.lastForm.reset()
    this.lastForm.markAsPending()
  }

}
