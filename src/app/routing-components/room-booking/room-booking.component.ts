import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/services/shared-service/shared.service';
import { environment } from 'src/environments/environments';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

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
    private sharedService: SharedService
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
    const user = sessionStorage.getItem('user');

    if (!user) {
      this.sharedService.showLoginDropdown.emit();
      console.log('User not logged in, opening login dropdown');
      return;
    }

    this.getProfile().pipe(
      switchMap((profileData: any) => {
        this.userProfile = profileData;
        const hotelDetails = JSON.parse(sessionStorage.getItem('hotelDetails')!);

        const paymentMethodId = Math.floor(100000000000 + Math.random() * 900000000000);
        const bookingPayload = {
          id:78,
          userId: this.userProfile.response.id,
          hotelId: hotelDetails.hotelId,
          roomGroupId: hotelDetails.roomGroupId,
          checkInDate: this.checkIn,
          checkOutDate: this.checkOut,
          bookingStatus: 'confirmed',
          guests: [
            {
              guestName: this.guestForm.get('firstName')?.value + ' ' + this.guestForm.get('lastName')?.value,
              guestEmail: this.guestForm.get('email')?.value,
              guestPhone: this.guestForm.get('phone')?.value
            }
          ],
          numberOfGuests: Number(this.adults) + Number(this.children),
          specialRequests: 'Room with balcony',
          totalPrice: hotelDetails.price,
          currencyCode: hotelDetails.currency,
          paymentStatus: 'Paid',
          paymentMethodId: paymentMethodId,
          mealPlan: hotelDetails.mealPlan,
          notes: 'No special notes'
        };

        return this.http.post(`${environment.baseUrl}/book`, bookingPayload);
      }),
      catchError((error) => {
        console.error('Error during booking:', error);
        return of(null); // Handle error and return observable
      })
    ).subscribe(
      (response: any) => {
        if (response) {
          console.log('Booking successful:', response);
        }
      }
    );
  }
}
