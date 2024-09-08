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
  rooms: any[] = [{ adults: 1, children: 0 }];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.location = params['location'] || '';
      this.checkInDate = params['checkIn'] || '';
      this.checkOutDate = params['checkOut'] || '';
      this.region = { id: params['regionId'] || '' };
      
      // Update the formatted date range
      this.updateFormattedDateRange();
      
      // If location is provided, fetch the region details
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
    if(query==""){
      this.suggestions.regions=[]
      this.suggestions.hotels=[]
      return
    }
   
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
    console.log(this.region)
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
    this.close.emit(false)
    this.router.navigate(['/hotels'], {
      queryParams: {
        location: this.location,
        regionId: this.region?.id,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: 1
      }
    });
   
  }

  closePopup() {
      this.isVisible = false;
      this.close.emit(this.isVisible)
  }

  getGuestsPlaceholder(): string {
    let totalAdults = 0;
    let totalChildren = 0;
  
    this.rooms.forEach(room => {
      totalAdults += room.adults;
      totalChildren += room.children;
    });
  
    return `${totalAdults} Adults, ${totalChildren} Child${totalChildren !== 1 ? 'ren' : ''}`;
  }
  

  clearLocation() {
    this.location = '';
    this.suggestions.regions=[]
    this.suggestions.hotels=[]
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