import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared-service/shared.service';
import { environment } from 'src/environments/environments';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-booking',
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.css']
})
export class RoomBookingComponent implements OnInit {
  hotelName: string = '';
  hotelId: any;
  roomGroupId: string = '';
  hotelRating: number = 0;
  hotelAddress: string = '';
  hotelImage: string = '';
  roomType: string = '';
  roomSize: string = '';
  mealPlan: string = '';
  cancellationPolicy: string = '';
  price: number = 0; // This represents the hotel price
  currency: string = '';
  guests: number = 0;
  checkIn: string = '';
  checkOut: string = '';
  checkInTime: string = '';
  checkOutTime: string = '';
  adults: number = 0;
  children: number = 0;
  taxAmount: number = 921.49;
  totalPrice: number = 75.82; // Example static total price
  localCurrency: string = '';
  nights: number | undefined;
  isModalVisible: boolean = false;  // Modal visibility state


  availableCurrencies: string[] = ['USD', 'EUR', 'GBP', 'INR'];
  selectedCurrency: string = ''; // Default currency
  conversionRates: { [key: string]: number } = {};
  convertedPrice: number = 0;
  userData: any;

  guestForm: FormGroup;
  userProfile: any;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.guestForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const storedDetails = sessionStorage.getItem('hotelDetails');
    const storedCurrency = localStorage.getItem('currency');

    if (storedCurrency) {
      this.selectedCurrency = storedCurrency;
      this.localCurrency = storedCurrency;
      this.currency = storedCurrency;
    } else {
      this.selectedCurrency = 'USD';
    }

    if (storedDetails) {
      const hotelDetails = JSON.parse(storedDetails);
      this.hotelName = hotelDetails.hotelName;
      this.hotelRating = hotelDetails.hotelRating;
      this.hotelAddress = hotelDetails.hotelAddress;
      this.hotelImage = hotelDetails.hotelImage;
      this.roomType = hotelDetails.roomType;
      this.roomSize = hotelDetails.roomSize;
      this.mealPlan = hotelDetails.mealPlan;
      this.cancellationPolicy = hotelDetails.cancellationPolicy;
      this.price = hotelDetails.price;
      this.guests = hotelDetails.guests;
      this.checkIn = hotelDetails.checkIn;
      this.checkOut = hotelDetails.checkOut;
      this.checkInTime = hotelDetails.checkInTime;
      this.checkOutTime = hotelDetails.checkOutTime;
      this.adults = hotelDetails.adults;
      this.children = hotelDetails.children;
    }

    const checkInDate = this.parseDate(this.checkIn);
    const checkOutDate = this.parseDate(this.checkOut);

    if (checkInDate && checkOutDate) {
      this.nights = this.calculateNights(checkInDate, checkOutDate);
    } else {
      console.error('Invalid check-in or check-out dates');
    }

    this.fetchExchangeRates();
  }

  getProfile() {
    this.userData = sessionStorage.getItem('user');
    const user = JSON.parse(this.userData);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    return this.http.get<any>(`${environment.baseUrl}/profile`, { headers });
  }

  fetchExchangeRates(): void {
    const apiUrl = 'https://api.exchangerate-api.com/v4/latest/' + this.selectedCurrency;
    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        this.conversionRates = data.rates;
        this.convertedPrice = this.convertPrice(this.price, this.selectedCurrency);
      },
      (error) => {
        console.error('Error fetching exchange rates', error);
      }
    );
  }

  convertPrice(price: number, currency: string): number {
    const conversionRate = this.conversionRates[currency] || 1;
    return price * conversionRate;
  }

  onCurrencyChange(event: any): void {
    const selectedCurrency = event.target.value;
    this.selectedCurrency = selectedCurrency;
    this.convertedPrice = this.convertPrice(this.price, selectedCurrency);
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }

  parseDate(dateString: string): Date | null {
    const cleanDateString = dateString.split(',')[0];
    const parsedDate = new Date(cleanDateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  calculateNights(checkIn: Date, checkOut: Date): number {
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }
  getStars(rating: number): number[] {
    return Array(rating).fill(1);  // Create an array with 'rating' number of elements
  }

  onSubmit() {
    this.userData = sessionStorage.getItem('user');
    if (!this.userData) {
      this.sharedService.showLoginDropdown.emit();
      console.log('User not logged in, opening login dropdown');
      return;
    }
  
    // Parse the user data to extract the token
    const user = JSON.parse(this.userData);
  
    // Define the headers with the token for authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
  
    const hotelDetails = JSON.parse(sessionStorage.getItem('hotelDetails')!);
  
    // Function to parse the date string like '01 Oct 2024, Tue' and convert it to a 'Date' object
    const parseDateString = (dateStr: string) => {
      // Remove the day of the week from the string
      const dateWithoutDay = dateStr.split(',')[0].trim(); // e.g., "01 Oct 2024"
      return new Date(dateWithoutDay); // Parse into Date object
    };
  
    const checkInDate = parseDateString(this.checkIn);
    const checkOutDate = parseDateString(this.checkOut);
  
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      console.error('Invalid check-in or check-out date');
      return;
    }
  
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);
  
    const bookingPayload = {
      userId: user.userId,
      hotelId: Number(hotelDetails.hotelId),
      rg_id:Number(hotelDetails.rg_id),
      roomGroupId: Number(hotelDetails.rg_id),
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
      bookingStatus: 'confirmed',
      guests: [
        {
          guestName: this.guestForm.get('firstName')?.value + ' ' + this.guestForm.get('lastName')?.value,
          guestEmail: this.guestForm.get('email')?.value,
          guestPhone: this.guestForm.get('phone')?.value,
        },
      ],
      numberOfGuests: Number(this.adults) + Number(this.children),
      specialRequests: 'Room with balcony',
      totalPrice: hotelDetails.price,
      currencyCode: hotelDetails.currency,
      paymentStatus: 'Paid',
      paymentMethodId: 2,
      mealPlan: hotelDetails.mealPlan,
      notes: 'No special notes',
    };
  
    // Include the headers in the HTTP POST request
    return this.http.post<any>(`${environment.baseUrl}/book`, bookingPayload, { headers, observe: 'response' })
      .subscribe((response) => {
        // Check for successful response (status 200 or 201)
        if (response.status === 200 || response.status === 201) {
          // Show the modal when response is successful
          this.isModalVisible = true;
        }
      }, error => {
        console.error('Error during booking', error);
      });
  }
  
  closeModal() {
    this.isModalVisible = false; // Hide the modal
    this.router.navigate(['/user/booking']); // Redirect to user/booking
  }
  
  
  
  
}
