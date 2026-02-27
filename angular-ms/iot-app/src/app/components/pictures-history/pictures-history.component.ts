import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { ArduinoService } from '@services/arduino.service'
import { Microcontroller } from '@models/microcontroller.model'
import { Pictures } from '@models/pictures.model'
import { MustBeOrderedDates } from '@helpers/must-be-ordered-dates.helper'

@Component({
    selector: 'app-pictures-history',
    styleUrls: ['./pictures-history.component.less'],
    templateUrl: './pictures-history.component.html'
})
export class PicturesHistoryComponent implements OnInit {

    micro: Microcontroller
    pictures: Pictures[] = []
    isLoading = false
    noResults = false

    historyForm: FormGroup

    constructor(
        private route: ActivatedRoute,
        private arduinoService: ArduinoService,
        private formBuilder: FormBuilder
    ) {
        this.historyForm = this.formBuilder.group(
            {
                init_date: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), Validators.required],
                end_date: [new Date(), Validators.required]
            },
            { validator: MustBeOrderedDates('init_date', 'end_date') }
        )
    }

    async ngOnInit() {
        const ip = this.route.snapshot.paramMap.get('ip')
        const measure = 'pictures'
        try {
            this.micro = await this.arduinoService.getMicrocontroller(ip, measure)
        } catch (error) { }
    }

    loadHistory({ init_date, end_date }: { init_date: Date, end_date: Date }) {
        this.isLoading = true
        this.noResults = false
        this.pictures = []

        this.arduinoService.getPicturesHistory(
            this.micro.ip,
            init_date.toJSON(),
            end_date.toJSON()
        ).subscribe(
            (data: Pictures[]) => {
                this.pictures = data
                this.noResults = data.length === 0
                this.isLoading = false
            },
            () => {
                this.noResults = true
                this.isLoading = false
            }
        )
    }

    stageLabel(stage: string): string {
        const labels: { [key: string]: string } = {
            seedling: '🌱 Brote',
            young_plant: '🌿 Planta joven',
            flowering: '🌸 Floración',
            green_fruit: '🍅 Fruto verde',
            ripe_fruit: '🍅 Fruto maduro'
        }
        return labels[stage] || stage
    }

}
