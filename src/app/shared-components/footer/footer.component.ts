import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  hideLogin: boolean = false;

  constructor(private router: Router){}
  ngOnInit(): void {
   
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkUrlForAdminLogin();
      }
    });
  }

    private checkUrlForAdminLogin(): void {
      if (this.router.url.includes('admin')) {
        this.hideLogin = true;
      } else {
        this.hideLogin = false;
      }
    }


}
