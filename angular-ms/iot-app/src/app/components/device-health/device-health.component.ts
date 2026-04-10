import { Component, OnInit, signal } from '@angular/core';
import { ArduinoService } from '@services/arduino.service';
import { Microcontroller } from '@models/microcontroller.model';

interface HealthStat {
  ip: string;
  sensor: string;
  measure: string;
  latency: number;
  uptime: number;
  battery: number | null;
  status: 'online' | 'warning' | 'offline';
}

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PipesModule } from '@modules/pipes.module';

@Component({
  selector: 'app-device-health',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    PipesModule
  ],
  templateUrl: './device-health.component.html',
  styleUrls: ['./device-health.component.less']
})
export class DeviceHealthComponent implements OnInit {
  healthData = signal<HealthStat[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private arduinoService: ArduinoService) {}

  ngOnInit(): void {
    this.refreshHealth();
  }

  refreshHealth(): void {
    this.isLoading.set(true);
    this.arduinoService.getMicrocontrollers().subscribe(micros => {
      this.calculateHealth(micros);
      this.isLoading.set(false);
    });
  }

  calculateHealth(micros: Microcontroller[]): void {
    const stats = micros.map(m => ({
      ip: m.ip,
      sensor: m.sensor,
      measure: m.measure,
      latency: Math.floor(Math.random() * 200) + 20,
      uptime: Math.floor(Math.random() * 95) + 5,
      battery: m.measure === 'humidity' ? Math.floor(Math.random() * 100) : null,
      status: this.getStatus(Math.random())
    }));
    this.healthData.set(stats as HealthStat[]);
  }

  private getStatus(rand: number): 'online' | 'warning' | 'offline' {
    if (rand > 0.8) return 'warning';
    if (rand < 0.05) return 'offline';
    return 'online';
  }
}
