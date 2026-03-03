import { Component, Input, OnInit } from '@angular/core';
import { AiService } from 'src/app/services/ai.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
    selector: 'app-ai-predictor',
    templateUrl: './ai-predictor.component.html',
    styleUrls: ['./ai-predictor.component.less']
})
export class AiPredictorComponent implements OnInit {
    @Input() ip!: string;
    @Input() measure!: string;
    @Input() recentValues: number[] = [];

    prediction: number | null = null;
    loading = false;
    training = false;
    trainingLimit = 1000;
    performance: { mae: number, sample_count: number } | null = null;

    limits = [
        { label: 'Últimas 100', value: 100 },
        { label: 'Últimas 500', value: 500 },
        { label: 'Todo el historial', value: 2000 }
    ];

    constructor(
        private aiService: AiService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.fetchPerformance();
    }

    fetchPerformance() {
        this.aiService.evaluate(this.ip, this.measure).subscribe({
            next: (res) => this.performance = res,
            error: () => this.performance = null
        });
    }

    train() {
        this.training = true;
        this.aiService.trainModel(this.ip, this.measure, this.trainingLimit).subscribe({
            next: () => {
                this.notificationService.notify('Modelo entrenado con éxito');
                this.training = false;
                this.fetchPerformance();
            },
            error: () => {
                this.notificationService.notify('Error al entrenar el modelo', 'error');
                this.training = false;
            }
        });
    }

    predict() {
        if (this.recentValues.length < 10) {
            this.notificationService.notify('Necesitas al menos 10 lecturas recientes', 'warning');
            return;
        }

        this.loading = true;
        this.aiService.predict(this.ip, this.measure, this.recentValues.slice(-10)).subscribe({
            next: (res) => {
                this.prediction = res.prediction;
                this.loading = false;
            },
            error: () => {
                this.notificationService.notify('Modelo no encontrado. ¡Entrénalo primero!', 'error');
                this.loading = false;
            }
        });
    }
}
