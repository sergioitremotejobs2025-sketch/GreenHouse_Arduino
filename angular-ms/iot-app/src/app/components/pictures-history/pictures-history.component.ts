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
    filteredPictures: Pictures[] = []
    isLoading = false
    noResults = false

    // Timelapse state
    isTimelapsePlaying = false
    timelapseIndex = 0
    timelapseTimer: any
    timelapseSpeed = 500

    historyForm: FormGroup
    currentStageFilter = 'all'

    stages = [
        { value: 'all', label: 'Todos los estados' },
        { value: 'seedling', label: '🌱 Brote' },
        { value: 'young_plant', label: '🌿 Planta joven' },
        { value: 'flowering', label: '🌸 Floración' },
        { value: 'green_fruit', label: '🍅 Fruto verde' },
        { value: 'ripe_fruit', label: '🍅 Fruto maduro' }
    ]

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
        this.stopTimelapse()

        this.arduinoService.getPicturesHistory(
            this.micro.ip,
            init_date.toJSON(),
            end_date.toJSON()
        ).subscribe(
            (data: Pictures[]) => {
                this.pictures = data
                this.applyFilter()
                this.noResults = data.length === 0
                this.isLoading = false
            },
            () => {
                this.noResults = true
                this.isLoading = false
            }
        )
    }

    applyFilter() {
        if (this.currentStageFilter === 'all') {
            this.filteredPictures = [...this.pictures]
        } else {
            this.filteredPictures = this.pictures.filter(p => p.stage === this.currentStageFilter)
        }
        this.noResults = this.filteredPictures.length === 0
    }

    toggleTimelapse() {
        if (this.isTimelapsePlaying) {
            this.stopTimelapse()
        } else if (this.filteredPictures.length > 0) {
            this.isTimelapsePlaying = true
            this.timelapseIndex = 0
            this.playNextFrame()
        }
    }

    playNextFrame() {
        this.timelapseTimer = setTimeout(() => {
            this.timelapseIndex = (this.timelapseIndex + 1) % this.filteredPictures.length
            if (this.isTimelapsePlaying) {
                this.playNextFrame()
            }
        }, this.timelapseSpeed)
    }

    stopTimelapse() {
        this.isTimelapsePlaying = false
        if (this.timelapseTimer) {
            clearTimeout(this.timelapseTimer)
        }
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
