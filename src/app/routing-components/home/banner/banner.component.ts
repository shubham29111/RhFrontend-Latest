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
    selectedLanguage: string = 'en';
    checkIn: string = '';
    checkOut: string = '';
    suggestions: { regions: any[], hotels: any[] } = { regions: [], hotels: [] };
    isGuestsDropdownVisible: boolean = false;
    isCheckInDropdownVisible: boolean = false;
    rooms: any[] = [{ adults: 1, children: 0, selectedChildren: [] }];
    showDropdownMenu: boolean = false;
    programmaticChange: boolean = false;
    region: any;
    hotel:any;
    type: any;
    selectedChildren: string[] = [];    // Array to store selected ages
    availableAges: string[] = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
    placeholder: string = 'Add a child';  // Initial placeholder text
        

    constructor(private http: HttpClient, private router: Router) {}
    ngOnInit(): void {
  
    this.currentDate();
  }
  
  // getTranslation(key: string): string {
  //   return this.translationService.getTranslation(key, this.selectedLanguage);
  // }

  currentDate()
  {
    const today = new Date();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkIn = tomorrow.toISOString().split('T')[0];
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    this.checkOut = dayAfterTomorrow.toISOString().split('T')[0];
  }
  
    
    onLocationChange(query: string) {
      if (this.programmaticChange) {
        this.programmaticChange = false;
        return;
      }
      if (query.length ) {
        this.http.get<any>(environment.baseUrl+`/regions?search=${query}`).subscribe(
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

    showDropdown() {
      if (this.location.length > 0) {
        this.onLocationChange(this.location);
        this.showDropdownMenu = true; 
      }
    }


    selectSuggestion(suggestion: any,type:any,event: MouseEvent) {
      event.stopPropagation();  

      this.region=suggestion;
      this.type=type;
      this.location = suggestion.name;
      this.suggestions = { regions: [], hotels: [] };
      this.showDropdownMenu = false; 
      this.programmaticChange = true; 
      
    }

    selectHotelSuggestion(suggestion: any, type: any, event: MouseEvent) {
      event.stopPropagation(); 
      this.hotel = suggestion;
      this.type = type;
      this.location = suggestion.name;
      this.suggestions = { regions: [], hotels: [] }; 
      this.showDropdownMenu = false; 
      this.programmaticChange = true;
    }
    
    toggleCheckInDropdown() {
      this.isCheckInDropdownVisible = !this.isCheckInDropdownVisible;
    }

    toggleGuestsDropdown() {
      this.isGuestsDropdownVisible = !this.isGuestsDropdownVisible;
    }
    addRoom() {
      this.rooms.push({ adults: 1, children: 0, selectedChildren: [] });
    }
    

    removeRoom(index: number, event: MouseEvent) {
      event.stopPropagation(); 
      if (this.rooms.length > 1) {
        this.rooms.splice(index, 1); 
      }
    }
    
    increaseAdults(roomIndex: number) {
      if (this.rooms[roomIndex].adults < 6) {
        this.rooms[roomIndex].adults++;
      }
    }
    
    decreaseAdults(roomIndex: number) {
      if (this.rooms[roomIndex].adults > 1) {
        this.rooms[roomIndex].adults--;
      }
    }
    

    decreaseChildren(roomIndex: number) {
      if (this.rooms[roomIndex].selectedChildren.length > 0) {
        this.rooms[roomIndex].selectedChildren.pop(); 
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
        totalChildren += room.selectedChildren.length;
      });
    
      const totalGuests = totalAdults + totalChildren;
    
      return `${totalGuests} guest${totalGuests > 1 ? 's' : ''}`;
    }
    

    onSubmit() {
      const totalAdults = this.rooms.reduce((sum, room) => sum + room.adults, 0);
      const totalChildren = this.rooms.reduce((sum, room) => sum + room.selectedChildren.length, 0);
      const guests = totalAdults + totalChildren;
    
      const childrenAges = this.rooms.flatMap(room => room.selectedChildren);
    
      if (this.type === "hotel") {
        this.router.navigate(['/hotelrooms'], {
          queryParams: {
            location: this.location,
            type: this.type,
            hotel: this.hotel.id,
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            guests,
            totalAdults,
            totalChildren,
            rooms: this.rooms.length,
            childrenAges 
          }
        });
      } else {
        this.router.navigate(['/hotels'], {
          queryParams: {
            location: this.location,
            type: this.type,
            regionId: this.region.id,
            checkIn: this.checkIn,
            checkOut: this.checkOut,
            guests,
            totalAdults,
            totalChildren,
            rooms: this.rooms.length,
            childrenAges 
          }
        });
      }
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
   
addChildAge(event: Event, roomIndex: number) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedAge = selectElement.value;

  if (selectedAge && this.rooms[roomIndex].selectedChildren.length < 4) {
    this.rooms[roomIndex].selectedChildren.push(selectedAge);
    selectElement.value = '';  
  }
}

removeChildAge(childIndex: number, roomIndex: number, event: MouseEvent) {
  event.stopPropagation();
  this.rooms[roomIndex].selectedChildren.splice(childIndex, 1);
}

}



