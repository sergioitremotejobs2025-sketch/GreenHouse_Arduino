import { Component, OnInit } from '@angular/core';
import { ArduinoService } from '../../services/arduino.service';
import { Microcontroller } from '../../models/microcontroller.model';
import { ChartConfiguration, ChartData } from 'chart.js';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseChartDirective } from 'ng2-charts';
import { PipesModule } from '@modules/pipes.module';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    BaseChartDirective,
    PipesModule
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.less']
})
export class AnalyticsComponent implements OnInit {
  microcontrollers: Microcontroller[] = [];
  selectedDevices: Microcontroller[] = [];
  isLoading = false;
  
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(255, 255, 255, 0.7)' } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: 'rgba(255, 255, 255, 0.5)' } }
    }
  };

  constructor(private arduinoService: ArduinoService) { }

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.isLoading = true;
    this.arduinoService.getMicrocontrollers().subscribe(data => {
      this.microcontrollers = data;
      this.isLoading = false;
    });
  }

  toggleDevice(device: Microcontroller): void {
    const index = this.selectedDevices.findIndex(d => d.ip === device.ip && d.measure === device.measure);
    if (index > -1) {
      this.selectedDevices.splice(index, 1);
    } else {
      this.selectedDevices.push(device);
    }
    this.refreshChart();
  }

  refreshChart(): void {
    if (this.selectedDevices.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    const datasets = this.selectedDevices.map((d, i) => ({
      data: [],
      label: `${d.ip} (${d.measure})`,
      borderColor: this.getColor(i),
      backgroundColor: this.getAlphaColor(i),
      fill: true,
      tension: 0.4
    }));

    this.chartData = { labels: [], datasets };
  }

  private getColor(index: number): string {
    const colors = ['#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#6366f1'];
    return colors[index % colors.length];
  }

  private getAlphaColor(index: number): string {
    const colors = ['rgba(6, 182, 212, 0.1)', 'rgba(244, 63, 94, 0.1)', 'rgba(16, 185, 129, 0.1)'];
    return colors[index % colors.length];
  }
}
