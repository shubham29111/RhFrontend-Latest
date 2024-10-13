import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-bookinghistory',
  templateUrl: './bookinghistory.component.html',
  styleUrls: ['./bookinghistory.component.css']
})
export class BookinghistoryComponent implements OnInit {
  bookings: any[] = []; // Will hold the merged bookings from upcoming and old bookings
  hotelImage = "";
  isReviewPopupOpen = false;
  selectedBooking: any;
  userData:any;
  overheaders:any;
  isThankYouPopupOpen = false; // For Thank You popup


  // Review data for the popup form
  reviewData = {
    rating: 5,
    comments: '',
    detailedRatings: {
      cleanness: 'Excellent',
      hygiene: 'Very Good',
      location: 'Perfect',
      meal: 'Good',
      price: 'Affordable',
      room: 'Spacious',
      services: 'Friendly staff',
      wifi: 'Strong'
    }
  };

  ratingValues = {
    
    'Excellent': 5,
    'Very Good': 4,
    'Good': 3,
    'Fair': 2,
    'Poor': 1,
    'Perfect': 5,
    'Affordable': 5,
    'Expensive': 1,
    'Spacious': 5,
    'Comfortable': 4,
    'Cramped': 2,
    'Friendly staff': 5,
    'Average service': 3,
    'Poor service': 1
  };

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBookingHistory();
  }

  // Fetch booking history from the API
  fetchBookingHistory(): void {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error('User not logged in.');
      
      // Redirect to the login page
      this.router.navigate(['/']); // Change '/login' to the desired route
      return;
    }

    const userData = JSON.parse(user);
    const headers = { Authorization: `Bearer ${userData.token}` };
    this.overheaders=headers;
    this.http.get<any>(`${environment.baseUrl}/bookings`, { headers }).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          // Merge old and upcoming bookings
          const hotelDetails = JSON.parse(sessionStorage.getItem('hotelDetails')!);

          this.bookings = [
            ...response.response.upcomingBookings,
            ...response.response.oldBookings
          ];

          this.hotelImage = hotelDetails.hotelImage;
          console.log('Booking history:', this.bookings);
        }
      },
      (error) => {
        console.error('Error fetching booking history', error);
      }
    );
  }

  closeThankYouPopup() {
    this.isThankYouPopupOpen = false;
  }

  calculateRating() {
    const detailedRatings = this.reviewData.detailedRatings;
  
    const totalRating = (
      this.ratingValues[detailedRatings.cleanness as keyof typeof this.ratingValues] +
      this.ratingValues[detailedRatings.hygiene as keyof typeof this.ratingValues] +
      this.ratingValues[detailedRatings.location as keyof typeof this.ratingValues] +
      this.ratingValues[detailedRatings.meal as keyof typeof this.ratingValues] +
      this.ratingValues[detailedRatings.price as keyof typeof this.ratingValues] +
      this.ratingValues[detailedRatings.room as keyof typeof this.ratingValues] +
      this.ratingValues[detailedRatings.services as keyof typeof this.ratingValues]
    ) / 7;
  
    this.reviewData.rating = parseFloat(totalRating.toFixed(1)); 
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
    console.log('Viewing booking details for:', booking);
  }

  // Opens the review popup for the selected booking
  openReviewPopup(booking: any) {
    this.selectedBooking = booking;
    this.isReviewPopupOpen = true;
  }

  // Closes the review popup
  closeReviewPopup() {
    this.isReviewPopupOpen = false;
  }

  // Submits the review to the server
  submitReview() {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error('User not logged in.');
      this.router.navigate(['/']); // Redirect to login if the user is not logged in
      return;
    }
  
    const userData = JSON.parse(user);
    const headers = { Authorization: `Bearer ${userData.token}` }; // Authorization header
  
    // Prepare the request body
    const requestBody = {
      userId: this.selectedBooking.userId, // Assuming booking has userId
      hotel: this.selectedBooking.Hotel?.hotel_id || '', // Get hotel name from the selected booking
      bookingId: this.selectedBooking.bookingId, // Include bookingId in the review
      rating: this.reviewData.rating,
      comments: this.reviewData.comments,
      detailedRatings: this.reviewData.detailedRatings
    };
  
    // Define the API endpoint
    const apiUrl = `${environment.baseUrl}/savereview`; // Replace with actual API endpoint
  
    // Send the POST request with the Authorization header
    this.http.post(apiUrl, requestBody, { headers }).subscribe(
      (response) => {
        console.log('Review submitted successfully:', response);
        this.closeReviewPopup(); // Close popup after successful submission
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }
  
}
