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

    constructor(
        private aiService: AiService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void { }

    train() {
        this.training = true;
        this.aiService.trainModel(this.ip, this.measure).subscribe({
            next: () => {
                this.notificationService.notify('Modelo entrenado con éxito');
                this.training = false;
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
