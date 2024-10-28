import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false; // Track login state locally

  constructor() {
    // Initialize the login state from localStorage on service creation
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  // Log in the user and update both local state and localStorage
  login(): void {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
  }

  // Log out the user and remove the login state from both local state and localStorage
  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }

  // Check if the user is authenticated by returning the local state
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
