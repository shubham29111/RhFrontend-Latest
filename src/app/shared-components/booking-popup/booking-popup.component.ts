import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.css']
})
export class BookingPopupComponent implements OnInit {
  @Input() location: string = '';
  @Input() checkInDate: string = '';
  @Input() checkOutDate: string = '';
  @Input() region: any;

  @Input() isVisible: boolean = true;

  @Output() close = new EventEmitter<void>(); 
   formattedDateRange: string = '';

  suggestions: { regions: any[], hotels: any[] } = { regions: [], hotels: [] };
  showDropdownMenu: boolean = false;
  programmaticChange: boolean = false;

  isGuestsDropdownVisible: boolean = false;
  rooms: any[] = [{ adults: 1, children: 0 }];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.updateFormattedDateRange();
  }

  onLocationChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
  
    if (this.programmaticChange) {
      this.programmaticChange = false;
      return;
    }
    
    if (query.length) {
      this.http.get<any>(`${environment.baseUrl}/regions?search=${query}`).subscribe(
        (data) => {
          console.log('API Response:', data);
          this.suggestions.regions = data.response.regions;
          this.suggestions.hotels = data.response.hotels;
          this.showDropdownMenu = true;
        },
        (error) => {
          console.error('Error fetching suggestions', error);
        }
      );
    } else {
      this.suggestions = { regions: [], hotels: [] };
      this.showDropdownMenu = false;
    }
  }
  

  selectSuggestion(suggestion: any) {
    this.region = suggestion;
    this.location = suggestion.name;
    this.suggestions = { regions: [], hotels: [] };
    this.showDropdownMenu = false;
    this.programmaticChange = true;
  }

  toggleGuestsDropdown() {
    this.isGuestsDropdownVisible = !this.isGuestsDropdownVisible;
  }

  // Other methods...

  updateFormattedDateRange() {
    if (this.checkInDate && this.checkOutDate) {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);

      const checkInFormatted = formatDate(checkIn, 'd MMMM yyyy', 'en');
      const checkOutFormatted = formatDate(checkOut, 'd MMMM yyyy', 'en');

      if (checkIn.getMonth() === checkOut.getMonth()) {
        // If both dates are in the same month, show only the day and the month once
        this.formattedDateRange = `${checkIn.getDate()} – ${checkOutFormatted}`;
      } else {
        this.formattedDateRange = `${checkInFormatted} – ${checkOutFormatted}`;
      }
    }
  }


  onSubmit() {
    // Ensure the date range is updated before submitting
    this.updateFormattedDateRange();

    this.router.navigate(['/hotels'], {
      queryParams: {
        location: this.location,
        regionId: this.region?.id,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.getGuestsPlaceholder()
      }
    });
  }

  closePopup() {
      this.isVisible = false;;  
  }

  getGuestsPlaceholder(): string {
    let totalAdults = 0;
    let totalChildren = 0;
  
    // Calculate total adults and children across all rooms
    this.rooms.forEach(room => {
      totalAdults += room.adults;
      totalChildren += room.children;
    });
  
    // Return a formatted string based on the total numbers
    return `${totalAdults} Adults, ${totalChildren} Child${totalChildren !== 1 ? 'ren' : ''}`;
  }
  

  clearLocation() {
    this.location = '';
    this.region = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isClickInsideDropdown = target.closest('.dropdown-menu') !== null;
    const isClickInsideInput = target.closest('.custom-input') !== null;

    if (!isClickInsideDropdown && !isClickInsideInput) {
      this.showDropdownMenu = false;
      this.isGuestsDropdownVisible = false;
    }
  }
}