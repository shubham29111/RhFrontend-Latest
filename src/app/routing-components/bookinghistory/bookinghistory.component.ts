import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-bookinghistory',
  templateUrl: './bookinghistory.component.html',
  styleUrls: ['./bookinghistory.component.css']
})
export class BookinghistoryComponent {
  bookings: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchBookingHistory();
  }

  // Fetch booking history from the API
  fetchBookingHistory(): void {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error('User not logged in.');
      return;
    }

    const userData = JSON.parse(user);
    const headers = { Authorization: `Bearer ${userData.token}` };

    this.http.get<any[]>(`${environment.baseUrl}/bookings`, { headers }).subscribe(
      (response) => {
        this.bookings = response;
        console.log('Booking history:', this.bookings);
      },
      (error) => {
        console.error('Error fetching booking history', error);
      }
    );
  }

  // Returns class for the booking status
  getBookingStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'confirmed';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

  // Function to view more details about the booking
  viewBookingDetails(booking: any): void {
    // Redirect to a detailed booking page or open a modal with more information
    console.log('Viewing booking details for:', booking);
  }
}