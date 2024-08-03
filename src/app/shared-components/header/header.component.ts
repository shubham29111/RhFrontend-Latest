import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TranslationService } from 'src/app/services/translation.service';
import translations from 'src/app/shared-components/header/translations.json';
declare const $: any;
declare var google: any;
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  selectedCurrency = 'USD';
  currencyPanelVisible = false;
  loginPanelVisible = false;
  loginUser = false;
  userName = '';
  selectedLanguage: string = 'en';
  translations: any = translations;


  constructor(private http: HttpClient,private translationService: TranslationService) {
    this.loadGoogleTranslate();

  }

  ngOnInit(): void {
    this.translationService.getLanguage().subscribe(language => {
      this.selectedLanguage = language;
    });

  }

  translateLanguage(language: string) {
    this.translationService.setLanguage(language);
  }


  getTranslation(key: string): string {
    return this.translationService.getTranslation(key, this.selectedLanguage);
  }

  getNestedTranslation(parentKey: string, childKey: string): string {
    return this.translationService.getNestedTranslation(parentKey, childKey, this.selectedLanguage);
  }

  toggleCurrencyPanel() {
    this.currencyPanelVisible = !this.currencyPanelVisible;
  }

  onCurrencySelected(currency: string) {
    this.selectedCurrency = currency;
    this.currencyPanelVisible = false;
  }

  closeCurrencyPanel() {
    this.currencyPanelVisible = false;
  }

  toggleLoginPanel() {
    this.loginPanelVisible = !this.loginPanelVisible;
  }

  closeLoginPanel() {
    this.loginPanelVisible = false;
  }

  updateUsername(userName: string) {
    this.userName = userName;
  }

  handleLoginUser(loginUser: boolean) {
    this.loginUser = loginUser;
  }

  ngAfterViewInit() {
    document.querySelectorAll('.keep-open').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });

    document.querySelectorAll('.nav-tabs .nav-link').forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const tabId = (e.target as HTMLElement).getAttribute('href');
        if (tabId) {
          document.querySelectorAll('.tab-pane').forEach((pane) => {
            pane.classList.remove('show', 'active');
          });
          document.querySelector(tabId)?.classList.add('show', 'active');
          document.querySelectorAll('.nav-tabs .nav-link').forEach((link) => {
            link.classList.remove('active');
          });
          (e.target as HTMLElement).classList.add('active');
        }
      });
    });


const avatarDropdown = document.getElementById('avatarDropdown');
    avatarDropdown?.addEventListener('click', () => {
      const chevronIcon = avatarDropdown.querySelector('.chevron-icon');
      if (chevronIcon) {
        chevronIcon.classList.toggle('rotate-180');
      }
    });
  }


  changeLanguage(langCode: string) {
    if (typeof google !== 'undefined' && google.translate && google.translate.TranslateElement) {
      const translateElement = new google.translate.TranslateElement();
      const control = translateElement.getControl();
      if (control) {
        control.setLanguage(langCode);
      }
    }
  }

  loadGoogleTranslate() {
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    googleTranslateScript.async = true;
    googleTranslateScript.defer = true;
    document.head.appendChild(googleTranslateScript);
    window.googleTranslateElementInit = this.googleTranslateElementInit.bind(this);
  }

  googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'en', 
      includedLanguages: 'en,ru,az', 
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
  
}
  
}