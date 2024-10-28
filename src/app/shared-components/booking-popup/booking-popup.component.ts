import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<Boolean>(); 
  formattedDateRange: string = '';

  suggestions: { regions: any[], hotels: any[] } = { regions: [], hotels: [] };
  showDropdownMenu: boolean = false;
  programmaticChange: boolean = false;

  isGuestsDropdownVisible: boolean = false;
  
  guests: number = 1;
  totalChildren: number = 0;
  totalAdults: number = 1;
  childrenAges: number[] = [];
  rooms: number = 1;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.location = params['location'] || '';
      this.checkInDate = params['checkIn'] || '';
      this.checkOutDate = params['checkOut'] || '';
      this.region = { id: params['regionId'] || '' };
      
      this.guests = params['guests'] || 1;
      this.totalChildren = params['totalChildren'] || 0;
      this.totalAdults = params['totalAdults'] || 1;
      this.childrenAges = params['childrenAges'] || [];
      this.rooms = params['rooms'] || 1;

      this.updateFormattedDateRange();
      
      if (this.location && this.region.id) {
        this.fetchRegionDetails();
      }
    });
  }

  fetchRegionDetails() {
    this.http.get<any>(`${environment.baseUrl}/regions/?search=${this.location}`).subscribe(
      (data) => {
        this.region = data.response;
      },
      (error) => {
        console.error('Error fetching region details', error);
      }
    );
  }

  onLocationChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    if(query === ""){
      this.suggestions.regions = [];
      this.suggestions.hotels = [];
      return;
    }
   
    if (this.programmaticChange) {
      this.programmaticChange = false;
      return;
    }
    
    if (query.length) {
      this.http.get<any>(`${environment.baseUrl}/regions?search=${query}`).subscribe(
        (data) => {
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

  updateFormattedDateRange() {
    if (this.checkInDate && this.checkOutDate) {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);

      const checkInFormatted = formatDate(checkIn, 'd MMMM yyyy', 'en');
      const checkOutFormatted = formatDate(checkOut, 'd MMMM yyyy', 'en');

      if (checkIn.getMonth() === checkOut.getMonth()) {
        this.formattedDateRange = `${checkIn.getDate()} – ${checkOutFormatted}`;
      } else {
        this.formattedDateRange = `${checkInFormatted} – ${checkOutFormatted}`;
      }
    }
  }

  onSubmit() {
    this.updateFormattedDateRange();
    this.isVisible = false;
    this.close.emit(false);

    const validRegionId = this.region?.id !== undefined && this.region?.id !== '' 
    ? this.region.id 
    : this.route.snapshot.queryParams['regionId'];     
    const childrenAges = this.childrenAges.length ? this.childrenAges.join(',') : null;

    this.isVisible = false;
    this.close.emit(false);
    
    this.router.navigate(['/hotels'], {
      queryParams: {
        location: this.location,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
        totalAdults: this.totalAdults,
        totalChildren: this.totalChildren,
        rooms: this.rooms
      }
    });
  }

  closePopup() {
    this.isVisible = false;
    this.close.emit(this.isVisible);
  }

  getGuestsPlaceholder(): string {
    return `${this.totalAdults} Adults, ${this.totalChildren} Child${this.totalChildren !== 1 ? 'ren' : ''}`;
  }

  clearLocation() {
    this.location = '';
    this.suggestions.regions = [];
    this.suggestions.hotels = [];
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
