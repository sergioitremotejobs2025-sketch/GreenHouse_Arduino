import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { ArduinoService } from '../../services/arduino.service';

interface PaletteItem {
  name: string;
  link: string;
  icon: string;
  type: 'nav' | 'device';
}

@Component({
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.less']
})
export class CommandPaletteComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  query = '';
  allItems: PaletteItem[] = [
    { name: 'Dashboard / Inicio', link: '/', icon: 'dashboard', type: 'nav' },
    { name: 'Analítica Avanzada / Trends', link: '/analytics', icon: 'bar_chart', type: 'nav' },
    { name: 'Ajustes de Dispositivos', link: '/settings', icon: 'settings', type: 'nav' },
    { name: 'Historial de Medidas', link: '/history', icon: 'history', type: 'nav' }
  ];
  filteredItems: PaletteItem[] = [];

  constructor(
    private router: Router,
    private arduinoService: ArduinoService,
    private dialogRef: MatDialogRef<CommandPaletteComponent>
  ) { }

  ngOnInit(): void {
    this.arduinoService.allArduinos.subscribe(arduinos => {
      const devices = arduinos.map(a => ({
        name: `Dispositivo: ${a.name} (${a.ip})`,
        link: '/', // In this app, we usually stay on dashboard since it's a SPA single view
        icon: 'memory',
        type: 'device' as const
      }));
      this.allItems = [...this.allItems, ...devices];
      this.filterItems();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.searchInput.nativeElement.focus(), 100);
  }

  filterItems(): void {
    if (!this.query) {
      this.filteredItems = this.allItems;
      return;
    }
    const q = this.query.toLowerCase();
    this.filteredItems = this.allItems.filter(i => 
      i.name.toLowerCase().includes(q)
    );
  }

  selectItem(item: PaletteItem): void {
    this.router.navigate([item.link]);
    this.dialogRef.close();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.dialogRef.close();
    }
    // Add arrow navigation logic here if needed
  }
}
