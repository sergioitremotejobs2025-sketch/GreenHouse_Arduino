import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<string>(localStorage.getItem('preferred_lang') || 'es');
  public lang$ = this.currentLang.asObservable();

  private translations: any = {
    'es': {
      'NAVBAR.TITLE': 'IoT_Microservices',
      'NAVBAR.ALERTS': 'Alertas recientes',
      'DASHBOARD.EMPTY_STATE': 'No tienes microcontroladores registrados',
      'DASHBOARD.EMPTY_SUB': 'Empieza por añadir tu primer dispositivo en la sección de ajustes para monitorizar tus plantas.',
      'DASHBOARD.ADD_DEV': 'Añadir dispositivo',
      'MEASURES.HUMIDITY': 'Humedad',
      'MEASURES.TEMPERATURE': 'Temperatura',
      'MEASURES.LIGHT': 'Bombilla inteligente',
      'MEASURES.PICTURES': 'Cámara',
      'ANALYTICS.TITLE': 'Analítica Avanzada'
    },
    'en': {
      'NAVBAR.TITLE': 'IoT_Microservices',
      'NAVBAR.ALERTS': 'Recent Alerts',
      'DASHBOARD.EMPTY_STATE': 'You have no registered microcontrollers',
      'DASHBOARD.EMPTY_SUB': 'Start by adding your first device in the settings section to monitor your plants.',
      'DASHBOARD.ADD_DEV': 'Add device',
      'MEASURES.HUMIDITY': 'Humidity',
      'MEASURES.TEMPERATURE': 'Temperature',
      'MEASURES.LIGHT': 'Smart Bulb',
      'MEASURES.PICTURES': 'Camera',
      'ANALYTICS.TITLE': 'Advanced Analytics'
    }
  };

  constructor() { }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLang.next(lang);
      localStorage.setItem('preferred_lang', lang);
    }
  }

  getCurrentLang(): string {
    return this.currentLang.value;
  }

  translate(key: string): string {
    const lang = this.getCurrentLang();
    return this.translations[lang][key] || key;
  }
}
