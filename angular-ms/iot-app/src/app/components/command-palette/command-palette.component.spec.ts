import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandPaletteComponent } from './command-palette.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ArduinoService } from '../../services/arduino.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CommandPaletteComponent', () => {
  let component: CommandPaletteComponent;
  let fixture: ComponentFixture<CommandPaletteComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let arduinoServiceSpy: jasmine.SpyObj<ArduinoService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CommandPaletteComponent>>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    arduinoServiceSpy = jasmine.createSpyObj('ArduinoService', ['allArduinos']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    arduinoServiceSpy.allArduinos = of([]); 

    await TestBed.configureTestingModule({
      declarations: [ CommandPaletteComponent ],
      imports: [ FormsModule, MatAutocompleteModule ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ArduinoService, useValue: arduinoServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items based on search query', () => {
    component.query = 'config';
    component.filterItems();
    // Assuming 'Configuración' is a default item
    expect(component.filteredItems.some(i => i.name.toLowerCase().includes('config'))).toBeTrue();
  });

  it('should navigate and close when item is selected', () => {
    const item = { name: 'Home', link: '/', type: 'nav' };
    component.selectItem(item);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
