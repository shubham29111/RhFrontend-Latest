import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
translateLanguage(arg0: string) {
throw new Error('Method not implemented.');
}
  selectedCurrency = 'USD';
  currencyPanelVisible = false;
  loginPanelVisible = false;
  loginUser = false;
  userName = '';
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
}