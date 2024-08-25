import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/services/translation.service';
import translations from 'src/app/shared-components/header/translations.json';
import { environment } from 'src/environments/environments';
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

  currencyPanelVisible = false;
  loginPanelVisible = false;
  loginUser = false;
  username: string | null = null;
  loginErrorMessage: string | null = null;
  signupErrorMessage: string | null = null;
  dropdownOpen: boolean = false;

  userName = '';
  selectedLanguage: string = 'en';
  translations: any = translations;
  selectedCurrency = 'INR';
  currencySearch = '';
  loading: boolean = false;

  
  popularCurrencies = [
    'USD US Dollar, $',
    'EUR Euro, €',
    'GBP British Pound Sterling, £',
    'UAH Ukrainian Hryvnia'
  ];
  
  allCurrencies = [
    'AED UAE Dirham',
    'AFN Afghani',
    'ALL Lek',
    'AMD Armenian Dram',
    'ANG Netherlands Antillean Guilder',
    'ARS Argentine Peso',
    'AUD Australian Dollar',
    'AZN Azerbaijani Manat',
    'BDT Bangladeshi Taka',
    'BGN Bulgarian Lev',
    'BHD Bahraini Dinar',
    'BND Brunei Dollar',
    'BRL Brazilian Real',
    'CAD Canadian Dollar',
    'CHF Swiss Franc',
    'CLP Chilean Peso',
    'CNY Chinese Yuan',
    'COP Colombian Peso',
    'CZK Czech Koruna',
    'DKK Danish Krone',
    'DZD Algerian Dinar',
    'EGP Egyptian Pound',
    'FJD Fijian Dollar',
    'GBP British Pound Sterling',
    'GEL Georgian Lari',
    'GHS Ghanaian Cedi',
    'HKD Hong Kong Dollar',
    'HUF Hungarian Forint',
    'IDR Indonesian Rupiah',
    'ILS Israeli New Shekel',
    'INR Indian Rupee',
    'IRR Iranian Rial',
    'ISK Icelandic Króna',
    'JMD Jamaican Dollar',
    'JOD Jordanian Dinar',
    'JPY Japanese Yen',
    'KES Kenyan Shilling',
    'KRW South Korean Won',
    'KWD Kuwaiti Dinar',
    'KZT Kazakhstani Tenge',
    'LBP Lebanese Pound',
    'LKR Sri Lankan Rupee',
    'LYD Libyan Dinar',
    'MAD Moroccan Dirham',
    'MDL Moldovan Leu',
    'MGA Malagasy Ariary',
    'MKD Macedonian Denar',
    'MMK Myanmar Kyat',
    'MNT Mongolian Tugrik',
    'MUR Mauritian Rupee',
    'MXN Mexican Peso',
    'MYR Malaysian Ringgit',
    'NAD Namibian Dollar',
    'NGN Nigerian Naira',
    'NOK Norwegian Krone',
    'NPR Nepalese Rupee',
    'NZD New Zealand Dollar',
    'OMR Omani Rial',
    'PEN Peruvian Sol',
    'PGK Papua New Guinean Kina',
    'PHP Philippine Peso',
    'PKR Pakistani Rupee',
    'PLN Polish Zloty',
    'PYG Paraguayan Guarani',
    'QAR Qatari Rial',
    'RON Romanian Leu',
    'RSD Serbian Dinar',
    'RUB Russian Ruble',
    'SAR Saudi Riyal',
    'SEK Swedish Krona',
    'SGD Singapore Dollar',
    'THB Thai Baht',
    'TRY Turkish Lira',
    'TWD New Taiwan Dollar',
    'TZS Tanzanian Shilling',
    'UAH Ukrainian Hryvnia',
    'UGX Ugandan Shilling',
    'USD US Dollar',
    'UYU Uruguayan Peso',
    'UZS Uzbekistani Som',
    'VND Vietnamese Dong',
    'XAF Central African CFA Franc',
    'XOF West African CFA Franc',
    'YER Yemeni Rial',
    'ZAR South African Rand',
    'ZMW Zambian Kwacha',
  ];
  

  filteredPopularCurrencies = [...this.popularCurrencies];
  filteredAllCurrencies = [...this.allCurrencies];


  constructor(private router: Router,private http: HttpClient,private translationService: TranslationService,) {
    this.loadGoogleTranslate();
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.username = JSON.parse(storedUser).username;
    }

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
filterCurrencies(): void {
  const searchTerm = this.currencySearch.toLowerCase();
  this.filteredPopularCurrencies = this.popularCurrencies.filter(currency =>
    currency.toLowerCase().includes(searchTerm)
  );
  this.filteredAllCurrencies = this.allCurrencies.filter(currency =>
    currency.toLowerCase().includes(searchTerm) && !this.popularCurrencies.includes(currency)
  );
}

changeCurrency(currency: string): void {
  const currencyCode = currency.split(' ')[0]; // Get the first 3 letters of the currency code
  this.selectedCurrency = currencyCode;
  localStorage.setItem('currency', currencyCode);
  this.updateUrlWithCurrency(currencyCode);
}

updateUrlWithCurrency(currency: string): void {
  this.router.navigate([], {
    queryParams: { currency },
    queryParamsHandling: 'merge',
  });
}

onLogin(form: NgForm) {
  this.loading = true;

  const loginData = {
    username: form.value.loginUsername,
    password: form.value.loginPassword,
  };

  this.http.post(`${environment.baseUrl}/signin`, loginData).subscribe(
    (response: any) => {
      this.loading = false;

      if (response.statusCode === 200) {
        // Clear any previous error message
        this.loginErrorMessage = null;

        // Extract the relevant data
        const userData = response.response;
        sessionStorage.setItem('user', JSON.stringify(userData));
        this.username = userData.username;  // Update the username
        console.log('Login successful', userData);
        window.location.reload();

      } else {
        this.loading = false;

        this.loginErrorMessage = response.errorMessage || 'An error occurred during login.';
        console.error('Login failed', response.errorMessage);
      }
    },
    (error) => {
      this.loginErrorMessage = error.error.message || 'An error occurred during login.';
      console.error('Login failed', error);
    }
  );
}

onSignup(form: NgForm) {
  this.loading = true;

  const signupData = {
    fullname: form.value.signupFullname,
    username: form.value.signupUsername,
    password: form.value.signupPassword,
    email: form.value.signupEmail,
  };

  this.http.post(`${environment.baseUrl}/signup`, signupData).subscribe(
    (response: any) => {
      this.loading = false;

      if (response.statusCode === 200) {
        // Clear any previous error message
        this.signupErrorMessage = null;

        // Extract the relevant data
        const userData = response.response;
        sessionStorage.setItem('user', JSON.stringify(userData));
        this.username = userData.username;  // Update the username
        console.log('Signup successful', userData);
        window.location.reload();

      } else {
        this.loading = false;

        this.signupErrorMessage = response.errorMessage || 'An error occurred during signup.';
        console.error('Signup failed', response.errorMessage);
      }
    },
    (error) => {
      this.signupErrorMessage = error.error.message || 'An error occurred during signup.';
      console.error('Signup failed', error);
    }
  );
}

logout() {
  sessionStorage.removeItem('user');
  this.username = null;
  console.log('Logged out');
  window.location.reload();  // Refresh the page
}

togglePasswordVisibility(inputId: string) {
  const passwordInput = document.getElementById(inputId) as HTMLInputElement;
  const icon = passwordInput.nextElementSibling as HTMLElement;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}
toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
  if (!this.dropdownOpen && !this.username) {
    this.clearForms();
  }
}
clearForms() {
  const loginForm = document.getElementById('loginForm') as HTMLFormElement;
  const signupForm = document.getElementById('signupForm') as HTMLFormElement;

  if (loginForm) {
    loginForm.reset();
  }
  if (signupForm) {
    signupForm.reset();
  }
}

}