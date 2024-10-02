import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { count } from 'rxjs';
import { HotelService } from 'src/app/services/hotel.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared-service/shared.service';
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

  loginData = {
    email: '',
    password: ''
  };

  signupData = {
    fullname: '',
    username: '',
    email: '',
    password: ''
  };

  
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
  
  hideLogin: boolean = false;


  filteredPopularCurrencies = [...this.popularCurrencies];
  filteredAllCurrencies = [...this.allCurrencies];

  showLoginPassword: boolean = false;
  showSignupPassword: boolean = false;
  dropdownState = { open: false }; // Object controlling dropdown visibility

  @ViewChild('dropdownToggle', { static: false }) dropdownToggle!: ElementRef; // ViewChild to access the dropdown toggle element

  constructor(private loadingService: LoadingService, private router: Router,private http: HttpClient,private translationService: TranslationService,
   private hotelService: HotelService,private sharedService: SharedService
  ) {
    this.loadGoogleTranslate();
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.username = user.username;
  
      if (user.isAdmin) {
        this.router.navigate(['/admin']);
      }
    }
  }

  ngOnInit(): void {
    this.sharedService.showLoginDropdown.subscribe(() => {
      console.log("hello");
      
      this.openDropdown();
    });
    this.translationService.getLanguage().subscribe(language => {
      this.selectedLanguage = language;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkUrlForAdminLogin();
      }
    });

  }
  openDropdown() {
    // Open the dropdown
    this.dropdownToggle.nativeElement.click();
  }

  private checkUrlForAdminLogin(): void {
    const reservedKeywords = ['admin','faq']; 
    if (reservedKeywords.some(keyword => this.router.url.includes(keyword))) {
      this.hideLogin = true;
    } else {
      this.hideLogin = false;
    }
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
    document.querySelectorAll('a[href*="elfsight.com/website-translator-widget"]').forEach(function(el) {
      (el as HTMLElement).style.setProperty('display', 'none', 'important');
    });
  
    
  

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

  loadGoogleTranslate() {
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    googleTranslateScript.async = true;
    googleTranslateScript.defer = true;
    document.head.appendChild(googleTranslateScript);
    window.googleTranslateElementInit = this.googleTranslateElementInit.bind(this);
  
    // Request location access from the user
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.handleLocationSuccess(position);
        },
        (error) => {
          console.error('Error getting location:', error);
          this.setDefaultLanguage('en'); // Fallback to English if there's an error
        },
        {
          enableHighAccuracy: true, // Use GPS for more accurate location data
          timeout: 10000,           // 10 seconds timeout
          maximumAge: 0             // Prevents cache, always fetches new location data
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.setDefaultLanguage('en'); // Fallback to English if geolocation is not supported
    }
  }

  
  googleTranslateElementInit(): void {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ru,az',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false  // Prevents automatic display of the selected language
    }, 'google_translate_element');
  }
  
  handleLocationSuccess(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    console.log(latitude)
    
    
    this.getCountryCodeByLatLng(latitude, longitude)
      .then((countryCode) => {
        const defaultLanguage = this.getLanguageByCountry(countryCode);
        this.setDefaultLanguage(defaultLanguage);
      })
      .catch((error) => {
        console.error('Error getting country code:', error);
        this.setDefaultLanguage('en'); // Fallback to English if there's an error
      });
  }
  
  async getCountryCodeByLatLng(latitude: number, longitude: number): Promise<string> {
    
  
    // forward geocoding example (address to coordinate)
    // var query = 'Philipsbornstr. 2, 30165 Hannover, Germany';
    // note: query needs to be URI encoded (see below)
     var data:any
   
      await this.hotelService.getCountry(latitude,longitude).subscribe(
        (res:any)=>{
          data=res
          console.log(res.results[0].components.country_code.toUpperCase())
        this.getCurrencyByCountry(res.results[0].components.country_code.toUpperCase())
        }
      )
      console.log(data)
    return new Promise((resolve, reject) => {
      // Example: resolve('US');
      // Example: reject('Error');
    });
  }


  getCurrencyByCountry(countryCode: string) {
    console.log(countryCode);
    this.hotelService.getCountryCurrency(countryCode).subscribe(
      (currencyRes: any) => {
        if (currencyRes && currencyRes.length > 0 && currencyRes[0].currencies) {
          const currencyKey = Object.keys(currencyRes[0].currencies)[0];
          const currency = currencyRes[0].currencies[currencyKey];
          
          localStorage.setItem('currencySymbol', currency.symbol);
          this.selectedCurrency = (currency.name.split(" ")[0].slice(0, 2) + currency.name.split(" ")[1].slice(0, 1)).toUpperCase();
          console.log(this.selectedCurrency);
          localStorage.setItem('currency', this.selectedCurrency);
        } else {
          // Fallback to USD if no response or empty response
          this.setDefaultCurrency();
        }
      },
      (error) => {
        // Handle error case
        console.error('Error fetching currency:', error);
        this.setDefaultCurrency(); // Fallback to USD on error
      }
    );
  }
  
  setDefaultCurrency() {
    localStorage.setItem('currencySymbol', '$');
    this.selectedCurrency = 'USD';
    localStorage.setItem('currency', this.selectedCurrency);
    console.log('Default currency set to USD');
  }
  

 
  
  getLanguageByCountry(country: string): string {
    const countryLanguageMap: { [key: string]: string } = {
      'US': 'en',
      'RU': 'ru',
      'AZ': 'az',
      // Add more countries and their corresponding languages here
    };
    return countryLanguageMap[country] || 'en'; // Default to English if country not mapped
  }
  
  setDefaultLanguage(language: string) {
    setTimeout(() => {
      const select = document.querySelector('#google_translate_element select') as HTMLSelectElement;
      if (select) {
        select.value = language;
        select.dispatchEvent(new Event('change'));
      }
    }, 1000); 
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
  console.log(this.selectedCurrency)
   this.hotelService.setCurrencyDetails(this.selectedCurrency)
  // this.updateUrlWithCurrency(currencyCode);
}

updateUrlWithCurrency(currency: string): void {
  this.router.navigate([], {
    queryParams: { currency },
    queryParamsHandling: 'merge',
  });
}

onLogin(form: NgForm) {
  if (form.valid) {
    this.loading = true;
    this.http.post(`${environment.baseUrl}/signin`, this.loginData).subscribe(
      (response: any) => {
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
          this.loginErrorMessage = response.errorMessage || 'An error occurred during login.';
          console.error('Login failed', response.errorMessage);
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        if (error.error && error.error.message === "Invalid username or password") {
          this.loginErrorMessage = "Invalid username or password";
        } else {
          this.loginErrorMessage = "An error occurred. Please try again.";
        }
      }
    );
  } else {
    this.loginErrorMessage = "Please fill in all required fields.";
  }
}

onSignup(form: NgForm) {
  if (form.invalid) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
    return;
  }

  this.loading = true;

  this.http.post(`${environment.baseUrl}/signup`, this.signupData).subscribe(
    (response: any) => {
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
        this.signupErrorMessage = response.errorMessage || 'An error occurred during signup.';
        console.error('Signup failed', response.errorMessage);
      }
      this.loading = false;
    },
    (error) => {
      this.signupErrorMessage = error.error.message || 'An error occurred during signup.';
      console.error('Signup failed', error);
      this.loading = false;
    }
  );
}

logout() {
  this.loadingService.show();

  sessionStorage.removeItem('user');
  this.username = null;
  console.log('Logged out');
  this.router.navigate(['']);

  window.location.reload(); 
  this.loadingService.hide();

}

togglePasswordVisibility(form: 'login' | 'signup') {
  if (form === 'login') {
    this.showLoginPassword = !this.showLoginPassword;
  } else {
    this.showSignupPassword = !this.showSignupPassword;
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