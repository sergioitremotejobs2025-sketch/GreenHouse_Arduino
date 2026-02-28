import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private snackBar: MatSnackBar) { }

    notify(message: string, type: 'success' | 'warning' | 'error' = 'success'): void {
        this.snackBar.open(message, 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: [`snackbar-${type}`]
        });
    }

    notifyAlert(measure: string, value: number, unit: string, threshold: number, isAbove: boolean): void {
        const direction = isAbove ? 'superior' : 'inferior';
        this.notify(
            `ALERTA: ${measure} (${value}${unit}) es ${direction} al umbral de ${threshold}${unit}`,
            'warning'
        );
    }
}
