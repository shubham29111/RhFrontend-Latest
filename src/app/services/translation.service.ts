import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import translations from 'src/assets/translations.json';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private languageSubject = new BehaviorSubject<string>('en'); // Default language
  translations: any = translations;

  constructor() {}

  setLanguage(language: string) {
    this.languageSubject.next(language);
  }

  getLanguage() {
    return this.languageSubject.asObservable();
  }

  getTranslation(key: string, language: string): string {
    return this.translations[language]?.navbar[key] || key;
  }

  getNestedTranslation(parentKey: string, childKey: string, language: string): string {
    return this.translations[language]?.navbar[parentKey]?.[childKey] || childKey;
  }
}
