import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-device-health',
  templateUrl: './device-health.component.html',
  styleUrls: ['./device-health.component.less']
})
export class DeviceHealthComponent implements OnInit {
  healthData: HealthStat[] = [];
  isLoading = true;

  constructor(private arduinoService: ArduinoService) {}

  ngOnInit(): void {
    this.refreshHealth();
  }

  refreshHealth(): void {
    this.isLoading = true;
    this.arduinoService.getMicrocontrollers().subscribe(micros => {
      this.calculateHealth(micros);
      this.isLoading = false;
    });
  }

  calculateHealth(micros: Microcontroller[]): void {
    this.healthData = micros.map(m => ({
      ip: m.ip,
      sensor: m.sensor,
      measure: m.measure,
      latency: Math.floor(Math.random() * 200) + 20, // Mocked latency
      uptime: Math.floor(Math.random() * 95) + 5,   // Mocked uptime %
      battery: m.measure === 'humidity' ? Math.floor(Math.random() * 100) : null,
      status: this.getStatus(Math.random())
    }));
  }

  private getStatus(rand: number): 'online' | 'warning' | 'offline' {
    if (rand > 0.8) return 'warning';
    if (rand < 0.05) return 'offline';
    return 'online';
  }
}
