import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  hideLogin: boolean = false;
  isPopupVisible = false;


  constructor(private router: Router){}
  ngOnInit(): void {
   
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkUrlForAdminLogin();
      }
    });
  }

    private checkUrlForAdminLogin(): void {
      const reservedKeywords = ['admin', 'reserve','faq']; 
      if (reservedKeywords.some(keyword => this.router.url.includes(keyword))) {
        this.hideLogin = true;
      } else {
        this.hideLogin = false;
      }
    }
    openPopup() {
      this.isPopupVisible = true;
    }
  
    // Function to close the popup
    closePopup() {
      this.isPopupVisible = false;
    }

}
