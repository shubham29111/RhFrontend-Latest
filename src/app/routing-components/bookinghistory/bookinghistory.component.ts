import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-bookinghistory',
  templateUrl: './bookinghistory.component.html',
  styleUrls: ['./bookinghistory.component.css']
})
export class BookinghistoryComponent implements OnInit {
  bookings: any[] = []; // Will hold the merged bookings from upcoming and old bookings
  hotelImage = '';
  isReviewPopupOpen = false;
  selectedBooking: any;
  userData: any;
  overheaders: any;
  isThankYouPopupOpen = false; // For Thank You popup

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

  constructor(private loadingService: LoadingService, private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchBookingHistory();
  }

  fetchBookingHistory(): void {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error('User not logged in.');
      this.router.navigate(['/']);
      return;
    }
  
    const userData = JSON.parse(user);
    const headers = { Authorization: `Bearer ${userData.token}` };
    this.overheaders = headers;
  
    this.http.get<any>(`${environment.baseUrl}/bookings`, { headers }).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.bookings = [
            ...response.response.upcomingBookings,
            ...response.response.oldBookings
          ].map((booking: any) => {
            const hotelImages = booking.Hotel?.HotelImages || [];
            const firstImage = hotelImages.length ? this.getImageUrl(hotelImages[0].images) : '';
            
            return {
              ...booking,
              hotelImage: firstImage
            };
          });
          // Print each booking to the console (optional)
          this.bookings.forEach(booking => {
            console.log('Booking:', booking);
          });
        } else {
          console.error('Error: Invalid response status code');
        }
      },
      (error) => {
        console.error('Error fetching booking history', error);
        this.router.navigate(['/']);
      }
    );
  }
  
  // Ensure the image URL is properly formatted
  // getImageUrl(imageUrl: string): string {
  //   if (imageUrl) {
  //     // Replace {size} with the actual size, such as 640x400
  //     return imageUrl.replace('{size}', '640x400');
  //   }
  //   return '';
  // }
  

  closeThankYouPopup(): void {
    this.isThankYouPopupOpen = false;
  }

  calculateRating(): void {
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

  viewBookingDetails(booking: any): void {
    // Implement logic to view booking details here
  }

  openReviewPopup(booking: any): void {
    this.selectedBooking = booking;
    this.isReviewPopupOpen = true;
  }

  closeReviewPopup(): void {
    this.isReviewPopupOpen = false;
  }

  submitReview(): void {
    const user = sessionStorage.getItem('user');
    if (!user) {
      console.error('User not logged in.');
      this.router.navigate(['/']);
      return;
    }

    const userData = JSON.parse(user);
    const headers = { Authorization: `Bearer ${userData.token}` }; 

    this.loadingService.show();
    const requestBody = {
      rating: this.reviewData.rating,
      comments: this.reviewData.comments,
      detailedRatings: this.reviewData.detailedRatings,
      userId: this.selectedBooking.userId, // Assuming booking has userId
      hotel: this.selectedBooking.Hotel?.hotel_id || '', // Get hotel name from the selected booking

    };
    const apiUrl = `${environment.baseUrl}/savereview`;

    this.http.post(apiUrl, requestBody, { headers }).subscribe(
      (response) => {
        this.loadingService.hide();
        console.log('Review submitted successfully');
        this.closeReviewPopup();
        this.isReviewPopupOpen = false;
      },
      (error) => {
        this.loadingService.hide();
        console.error('Error submitting review:', error);
      }
    );
  }

  getImageUrl(imageUrl: string): string {
    if (imageUrl) {
      return imageUrl.replace('{size}', '640x400');
    }
    return '';
  }
}
