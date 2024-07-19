import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  location: string = '';
  checkIn: string = '';
  checkOut: string = '';
  suggestions: { regions: any[], hotels: any[] } = { regions: [], hotels: [] };
  isGuestsDropdownVisible: boolean = false;
  rooms: any[] = [{ adults: 1, children: 0 }];
  showDropdownMenu: boolean = false;
  programmaticChange: boolean = false;
  region: any;

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
  this.currentDate();
}

  currentDate()
  {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkIn = today.toISOString().split('T')[0];
    this.checkOut = tomorrow.toISOString().split('T')[0];
  }
  
  onLocationChange(query: string) {
    if (this.programmaticChange) {
      this.programmaticChange = false;
      return;
    }
    if (query.length ) {
      this.http.get<any>(environment.baseUrl+`/regions?search=${query}`).subscribe(
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

  showDropdown() {
    if (this.location.length > 0) {
      this.onLocationChange(this.location);
      this.showDropdownMenu = true; 
    }
  }


  selectSuggestion(suggestion: any) {
    this.region=suggestion;
    this.location = suggestion.name;
    this.suggestions = { regions: [], hotels: [] };
    this.showDropdownMenu = false; 
    this.programmaticChange = true; 
  }
  toggleGuestsDropdown() {
    this.isGuestsDropdownVisible = !this.isGuestsDropdownVisible;
  }

  addRoom() {
    this.rooms.push({ adults: 1, children: 0 });
  }

  removeRoom(index: number) {
    if (this.rooms.length > 1) {
      this.rooms.splice(index, 1);
    }
  }

  decreaseAdults(index: number) {
    if (this.rooms[index].adults > 1) {
      this.rooms[index].adults--;
    }
  }

  increaseAdults(index: number) {
    this.rooms[index].adults++;
  }

  decreaseChildren(index: number) {
    if (this.rooms[index].children > 0) {
      this.rooms[index].children--;
    }
  }

  increaseChildren(index: number) {
    this.rooms[index].children++;
  }

  getGuestsPlaceholder() {
    let totalAdults = 0;
    let totalChildren = 0;
    this.rooms.forEach(room => {
      totalAdults += room.adults;
      totalChildren += room.children;
    });
    return `${totalAdults} Adults, ${totalChildren} Child`;
  }

  onSubmit() {
    const totalAdults = this.rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = this.rooms.reduce((sum, room) => sum + room.children, 0);
    const guests = totalAdults + totalChildren;

    this.router.navigate(['/hotels'], {
      queryParams: {
        location: this.location,
        regionId: this.region.id,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        guests
      }
    });
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


