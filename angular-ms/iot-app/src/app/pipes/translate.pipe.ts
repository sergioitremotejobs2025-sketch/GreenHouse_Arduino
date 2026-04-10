import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  pure: false // Set to false to respond to language changes dynamically if needed, 
              // although better to use an observable if many changes occur.
})
export class TranslatePipe implements PipeTransform {

  constructor(private languageService: LanguageService) {}

  transform(key: string): string {
    return this.languageService.translate(key);
  }

}
