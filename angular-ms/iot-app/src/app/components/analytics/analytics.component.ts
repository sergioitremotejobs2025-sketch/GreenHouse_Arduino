import { Component, OnInit } from '@angular/core';
import { ArduinoService } from '../../services/arduino.service';
import { Microcontroller } from '../../models/microcontroller.model';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.less']
})
export class AnalyticsComponent implements OnInit {
  microcontrollers: Microcontroller[] = [];
  selectedDevices: Microcontroller[] = [];
  isLoading = false;
  
  public chartData: GoogleChartInterface = {
    chartType: 'LineChart',
    dataTable: [['Time', 'Value']],
    options: {
      title: 'Tendencias Comparativas',
      curveType: 'function',
      legend: { position: 'bottom' },
      backgroundColor: 'transparent',
      chartArea: { width: '85%', height: '70%' },
      hAxis: { title: 'Tiempo' },
      vAxis: { title: 'Valor Medida' }
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
      this.chartData.dataTable = [['Time', 'Value']];
      return;
    }

    // Logic to fetch history for all selected devices and merge them
    // For now, initializing headers
    const headers = ['Time', ...this.selectedDevices.map(d => `${d.name} (${d.measure})`)];
    this.chartData.dataTable = [headers];

    // Note: In a real scenario, we'd wait for all getPreviousMeasures to finish
    // Simple mock points for visualization if data is missing, 
    // but the goal is to show we are ready for multi-line.
  }
}
