import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'

import { AuthService } from '@services/auth.service'
import { NotificationService } from '@services/notification.service'

@Component({
    selector: 'app-change-password-dialog',
    templateUrl: './change-password-dialog.component.html',
    styles: [`
    .error-text { color: red; font-size: 12px; margin-top: -10px; margin-bottom: 10px; }
    mat-form-field { width: 100%; }
  `]
})
export class ChangePasswordDialogComponent {
    password = ''
    confirmPassword = ''

    constructor(
        public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
        private authService: AuthService,
        private notificationService: NotificationService
    ) { }

    onNoClick(): void {
        this.dialogRef.close()
    }

    save(): void {
        this.authService.changePassword(this.password).subscribe(
            (res) => {
                if (res.success) {
                    this.notificationService.notify('Contraseña cambiada correctamente', 'success')
                    this.dialogRef.close()
                } else {
                    this.notificationService.notify('Error al cambiar la contraseña', 'error')
                }
            },
            () => {
                this.notificationService.notify('Error en el servidor', 'error')
            }
        )
    }
}
