import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  loading: boolean = false;
  loginErrorMessage: string | null = null;
  username: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(form: NgForm) {
    this.loading = true;

    const loginData = {
      email: form.value.loginUsername,
      password: form.value.loginPassword,
    };

    this.http.post(`${environment.baseUrl}/signin`, loginData).subscribe(
      (response: any) => {
        this.loading = false;

        if (response.statusCode === 200) {
          this.loginErrorMessage = null;

          const userData = response.response;
          sessionStorage.setItem('user', JSON.stringify(userData));
          this.username = userData.username;  
          this.router.navigate(['/admin']);
        } else {
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

}
