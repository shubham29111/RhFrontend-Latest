import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as L from 'leaflet';
import { catchError, flatMap, forkJoin, of } from 'rxjs';
import { Observable } from 'rxjs';
import { HotelService } from 'src/app/services/hotel.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookingService } from 'src/app/services/booking.service';

interface Place {
  lat: number;
  lon: number;
  tags: {
    name?: string;
    shop?: string;
    tourism?: string;
    natural?: string;
    leisure?: string;
    aeroway?: string;
    amenity?: string;
    religion?: string;
    historic?: string;
  };
  distance?: number;
}

// Update or add this interface
interface RoomRate {
  roomDetails: {
    roomType: string;
    size: string;
    amenities: string[];
  };
  rates: {
    price: number;
    currency: string;
    cancellationPolicy: string;
    mealPlan: string;
  }[];
}

interface DetailedRatings {
  meal: string;
  room: string;
  wifi: string;
  price: string;
  hygiene: string | null;
  location: string;
  services: string;
  cleanness: string;
}

interface UserReview {
  id: number;
  adults: number;
  author: string;
  images: string[] | null;
  nights: number;
  rating: number;
  created: string;
  children: number;
  room_name: string;
  trip_type: string;
  review_plus: string | null;
  review_minus: string | null;
  traveller_type: string;
}

interface UserReviewsResponse {
  hotel_id: string;
  detail_review_rating: number;
  detailedratings: DetailedRatings;
  userreviews: UserReview[];
}



@Component({
  selector: 'app-hotel-rooms',
  templateUrl: './hotel-rooms.component.html',
  styleUrls: ['./hotel-rooms.component.css'],
  providers: [DatePipe]
})
export class HotelRoomsComponent implements OnInit, AfterViewInit {

  hotel: any;
  rooms: any[] = [];
  images: string[] = [];
  roomGroups: any[] = [];
  selectedImageUrl: string = '';
  isModalOpen: boolean = false;
  loading:boolean=false;
  loadingPrices:boolean=false;
  showAllReviews = false; // Track whether to show all or just 3 reviews

  hotelId: string = '';
  hotelPrice: any;
  guests: any;
  availableRooms: { [key: string]: RoomRate[] } = {};

  checkInDate:any;
  checkOutDate:any;
  checkIn:any;
  checkOut:any;
  childs:any;
  adults:any;
  children:any;
  checkInHour: number = 0;
  checkOutHour: number = 0;
  hotelRating1: number =0;  // Add this line for the hotel rating
  detailedRatings: any; // Add this line for the detailed ratings
  
  availablePercentage: number = 0;
  map: any;
  hotelLatitude: number = 0;
  storedPrice: number = 0;
  hotelLongitude: number = 0;
  nearbyPlaces: { [key: string]: Place[] } = {
    landmarks: [],
    airports: [],
    shopping: [],
    parks: [],
    theaters: [],
    temples: [],
    historical: [],
    churches: []
  };
  displayPlaces: Place[] = [];
  mainAmenities: string[] = [];
  policyStructs: any[] = [];
  displayedReviews: any[] = []; // Reviews to display (initially 3)

  roomGroup: any; 
  isRoomModalOpen: boolean = false; 
  selectedRoomUrl: string ="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"; // To store the selected image URL

  filterForm: FormGroup;
  filteredRooms: { [key: string]: RoomRate[] } = {};
  reviews: any[] = []; // Store reviews
  loadingReviews = false;
  page = 1;
  limit = 5; // Limit per page
  totalReviews = 0;
  totalPages = 1;

  nearbyPlaceCategories = [
    { title: 'Landmarks', icon: 'fas fa-landmark', places: this.nearbyPlaces['landmarks'] },
    { title: 'Airports', icon: 'fas fa-plane-departure', places: this.nearbyPlaces['airports'] },
    { title: 'Shopping Places', icon: 'fas fa-shopping-cart', places: this.nearbyPlaces['shopping'] },
    { title: 'Parks', icon: 'fas fa-tree', places: this.nearbyPlaces['parks'] },
    { title: 'Theaters', icon: 'fas fa-theater-masks', places: this.nearbyPlaces['theaters'] },
    { title: 'Temples', icon: 'fas fa-place-of-worship', places: this.nearbyPlaces['temples'] },
    { title: 'Historical Places', icon: 'fas fa-monument', places: this.nearbyPlaces['historical'] },
    { title: 'Churches', icon: 'fas fa-church', places: this.nearbyPlaces['churches'] }
  ];

  currency: any;
  constructor(private router: Router,private bookingService:BookingService,  private hotelService: HotelService,private datePipe: DatePipe, private http: HttpClient, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      beds: ['all'],
      meals: ['all'],
      payment: ['all'],
      cancellation: ['all']
    });
  }

  ngOnInit(): void {
    this.loadingPrices=true;

    this.route.queryParams.subscribe(params => {
      this.hotelId = params['hotel'];
      this.hotelPrice = params['hotelPrices'];
      this.guests = params['guests'];
      this.adults=params['adults'] || 1;
      this.childs=params['childs'] ;
      this.children = Array.isArray(params['children']) ? params['children'] : [];
      if (params['checkIn'] && params['checkOut']) {
        // Use the provided dates
        this.checkInDate = new Date(params['checkIn']);
        this.checkOutDate = new Date(params['checkOut']);
      } else {
        // If no checkIn/checkOut parameters, set default to next day and day after
        const today = new Date();
        this.checkInDate = new Date(today);
        this.checkInDate.setDate(today.getDate() + 1); // Next day
  
        this.checkOutDate = new Date(today);
        this.checkOutDate.setDate(today.getDate() + 2); // Day after next
      }
      this.checkIn = this.datePipe.transform(this.checkInDate, 'dd MMM yyyy, EEE');
      this.checkOut = this.datePipe.transform(this.checkOutDate, 'dd MMM yyyy, EEE');
    });
    
    this.currency =localStorage.getItem('currency') || "USD";
    this.hotelService.getCurrencyDetailsObseravble().subscribe(
      (res)=>{
        if(res){
         
        this.loading=true;
        this.loadingPrices=true;
        this.currency=res
        this.fetchRoomGroups();
        this.fetchHotelPrices()
       
        
        }
      }
    )
    // this.fetchReviews(this.page, this.limit);
    this.getHotelData();
    this.getReviewsData();
    this.filteredRooms = this.availableRooms;

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    // this.initMap();
    // this.getNearbyPlaces();
  }

  applyFilters(): void {
    if (this.isDefaultFilter()) {
      this.filteredRooms = {...this.availableRooms};
    } else {
      this.filteredRooms = {};
      for (const [roomType, roomRates] of Object.entries(this.availableRooms)) {
        const filteredRates = roomRates.filter(rate => {
          return (
            (!this.filterForm.value.beds || this.filterForm.value.beds === 'all' || 
             rate.roomDetails.size?.includes(this.filterForm.value.beds) ||
             rate.roomDetails.amenities.some(a => a.toLowerCase().includes(this.filterForm.value.beds))) &&
            (!this.filterForm.value.meals || this.filterForm.value.meals === 'all' || 
             rate.rates.some(r => r.mealPlan.toLowerCase().includes(this.filterForm.value.meals))) &&
            (!this.filterForm.value.payment || this.filterForm.value.payment === 'all') &&
            (!this.filterForm.value.cancellation || this.filterForm.value.cancellation === 'all' ||
             rate.rates.some(r => r.cancellationPolicy.toLowerCase().includes(this.filterForm.value.cancellation)))
          );
        });
        if (filteredRates.length > 0) {
          this.filteredRooms[roomType] = filteredRates;
        }
      }
    }
  }

  isDefaultFilter(): boolean {
    return Object.values(this.filterForm.value).every(value => !value || value === 'all');
  }


  getHotelData(): void {
    this.loading=true;
    this.http.get(environment.baseUrl + '/hotels/' + this.hotelId)
      .subscribe((response: any) => {
        this.hotel = response.response;
        this.images = this.hotel?.images;
        if (this.images && this.images.length > 0) {
          this.selectedImageUrl = this.getImageUrl(this.images[0]);
        }
        this.extractMainAmenities();
        this.policyStructs = this.hotel?.PolicyStructs || [];

        this.loading=false;

        this.calculateHours();
        this.hotelLatitude = this.hotel?.latitude;
        this.hotelLongitude = this.hotel?.longitude;
        this.getNearbyPlaces();
        this.fetchHotelPrices();
        this.fetchRoomGroups();
        this.initMap();
        

    // this.getNearbyPlaces();


      });
  }
  private extractMainAmenities(): void {
    const keyAmenities = [
      'Free Wi-Fi',
      'Parking',
      'Swimming pool',
      'Air conditioning',
      '24-hour reception',
      'Non-smoking rooms',
      'Room service',
      'Breakfast',
      'Laundry',
      'Car rental'
    ];

    this.mainAmenities = this.hotel.amenities
    .flatMap((group: { amenities: string[] }) => group.amenities)
    .filter((amenity: string) => keyAmenities.includes(amenity))
    .slice(0, 5);  
  }

  
  
  fetchHotelPrices() {
    this.loadingPrices=true;
    this.route.queryParams.subscribe(params => {
      const today = new Date();

    // Set 'checkIn' to tomorrow's date if it's not available
    this.checkIn = params['checkIn'] || this.datePipe.transform(new Date(today.setDate(today.getDate() + 1)), 'yyyy-MM-dd');

    // Reset today's date and set 'checkOut' to the day after tomorrow if it's not available
    const dayAfterTomorrow = new Date();
    this.checkOut = params['checkOut'] || this.datePipe.transform(new Date(dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)), 'yyyy-MM-dd');
      const requestBody = {
        hotelId: this.hotelId,
        currency: this.currency,
        checkIn:this.checkIn,
        checkOut: this.checkOut,
        rooms: 1,
        adults: Number(this.adults),
        children:this.children
      };
  
      this.http.post(`${environment.baseUrl}/hotels/fetch-prices`, requestBody)
        .subscribe({
          next: (response: any) => {
            this.availableRooms = response.response;
            this.filteredRooms = {...this.availableRooms}; // Set filteredRooms here
  
              this.loadingPrices=false;
            this.storedPrice = this.getLowestPriceAcrossAllRooms(this.availableRooms);
          },
          error: (error: any) => {
            console.error('Error fetching hotel prices:', error);
          }
        });
    });

    
  }

  fetchRoomGroups(): void {
    const payload = { hotel_id: this.hotelId };
    
    this.http.get(`${environment.baseUrl}/room-groups?hotel_id=${this.hotelId}`, {})
    .pipe(
      catchError(error => {
          console.error('Error fetching room groups:', error);
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response) {
          this.roomGroups = response.response || [];
          this.roomGroup = response.response; 
            this.selectedRoomUrl = this.roomGroup.images[0]; 
        }
      });
  }
  
  

  // Helper method to find the lowest price for a room
  getLowestPriceAcrossAllRooms(rooms: { [key: string]: RoomRate[] }): number {
    let lowestPrice = Infinity;
  
    for (let roomKey in rooms) {
      const roomRates = rooms[roomKey];
      const roomLowestPrice = this.getLowestPrice(roomRates);
      if (roomLowestPrice < lowestPrice) {
        lowestPrice = roomLowestPrice;
      }
    }
  
    return lowestPrice === Infinity ? 0 : lowestPrice;
  }
  getRoomImageUrl(imageUrl: string): string {
    // Replace the {size} placeholder with '132x104'
    return imageUrl.replace('{size}', '132x104');
  }
  
  // Existing method to find the lowest price for a single room
  getLowestPrice(roomRates: any): number {
    let lowestPrice = Infinity;
  
    roomRates.forEach((rate: any) => {
      rate.rates.forEach((rateDetails: any) => {
        const price = parseFloat(rateDetails.price);
        if (price < lowestPrice) {
          lowestPrice = price;
        }
      });
    });
  
    return lowestPrice === Infinity ? 0 : lowestPrice;
  }


  private formatDate(date: string): string {
    // Assuming date is in format 'dd MMM yyyy, EEE'
    return this.datePipe.transform(new Date(date), 'yyyy-MM-dd') || '';
  }


  // getReviewsData(): void {
  //   this.http.get<UserReviewsResponse>(environment.baseUrl + '/userreviews?hotelId=' + this.hotelId)
  //     .subscribe((response: UserReviewsResponse) => {
  //       if (response) {
  //         // Store the detailed ratings and user reviews separately
  //         this.reviews = response.userreviews || [];
  //         this.hotelRating1 = response.detail_review_rating;
  //         this.detailedRatings = response.detailedratings; // This should work now
  //       }
  //     });
  // }

  
  getAmenityIcon(amenity: string): string {
    const iconMap: { [key: string]: string } = {
      'Free Wi-Fi': 'fas fa-wifi',
      'Parking': 'fas fa-parking',
      'Swimming pool': 'fas fa-swimming-pool',
      'Air conditioning': 'fas fa-snowflake',
      '24-hour reception': 'fas fa-concierge-bell',
      'Non-smoking rooms': 'fas fa-smoking-ban',
      'Room service': 'fas fa-concierge-bell',
      'Breakfast': 'fas fa-coffee',
      'Laundry': 'fas fa-tshirt',
      'Car rental': 'fas fa-car'
    };

    return iconMap[amenity] || 'fas fa-check-circle';
  }
  getImageUrl(imageUrl: string): string {
    if (imageUrl) {      
      return imageUrl.replace('{size}', '640x400');
    }
    return '';
  }
  getImageUrl2(imageUrl: string): string {
    if (imageUrl) {
      return imageUrl.replace('{size}', '120x120');
    }
    return '';
  }

  selectImage(imageUrl: string): void {
    if (imageUrl) {
      this.selectedImageUrl = this.getImageUrl(imageUrl);
    }
  }
  selectRoomImage(imageUrl: string): void {
    if (imageUrl) {
      this.selectedRoomUrl = this.getImageUrl(imageUrl);
    }

  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  openRoomModal(): void {
    this.isRoomModalOpen = true;
  }

  closeRoomModal(): void {
    this.isRoomModalOpen = false;
  }


  scrollLeft(): void {
    const container = document.querySelector('.image-slider');
    if (container) {
      container.scrollBy({ left: -150, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const container = document.querySelector('.image-slider');
    if (container) {
      container.scrollBy({ left: 150, behavior: 'smooth' });
    }
  }

  getStars(starRating: number): string {
    let stars = '';
    for (let i = 0; i < starRating; i++) {
      stars += '⭐';
    }
    for (let i = starRating; i < 5; i++) {
      stars += '';
    }
    return stars;
  }

  getStarsArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    return Array(fullStars).fill(1); // Array of filled stars
  }
  
  getEmptyStarsArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const emptyStars = Math.max(0, 5 - fullStars); // Ensure emptyStars is never negative
    return Array(emptyStars).fill(1); // Array of empty stars
  }
  

  calculateHours(): void {
    this.checkInHour = this.timeStringToHour(this.hotel?.check_in_time);
    this.checkOutHour = this.timeStringToHour(this.hotel?.check_out_time);
  }

  timeStringToHour(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }

  scrollToAmenities(): void {
    const element = document.getElementById('amenities-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  scrollToMap(): void {
    const element = document.getElementById('section-map');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  private initMap(): void {

    const hotelLatitude = this.hotel?.latitude || 40.7128;
    const hotelLongitude = this.hotel?.longitude || -74.0060;
    // Initialize the map centered on the hotel location, with scroll zoom disabled
    this.map = L.map('map', {
      center: [hotelLatitude, hotelLongitude],
      zoom: 16,
      scrollWheelZoom: false,  
      zoomControl: false      
    });
  
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  
    // Create a marker for the hotel location
    const marker = L.marker([hotelLatitude, hotelLongitude]).addTo(this.map);
  
    // Add a popup to the marker
    const popupContent = `
      <div style="text-align: center;">
        <h3>${this.hotel.name}</h3>
        <img src="${this.getImageUrl(this.hotel.images[0])}" alt="Hotel Image" />
      </div>
    `;
    marker.bindPopup(popupContent).openPopup();
  
    // Create a circle with a 500-meter radius around the hotel
    const circle = L.circle([hotelLatitude, hotelLongitude], {
      color: '#1d8fd6',      // Circle border color
      fillColor: '#1d8fd6',  // Circle fill color
      fillOpacity: 0.2,      // Fill opacity
      radius: 500            // Radius in meters
    }).addTo(this.map);
  
    // Adjust the map view to fit the circle bounds
    this.map.fitBounds(circle.getBounds(), {
      padding: [20, 20]      // Optional: padding around the edges of the map
    });
  
    // Add custom zoom control (with + and - buttons)
    L.control.zoom({
      position: 'topright'   // Position the zoom control in the top-right corner
    }).addTo(this.map);

  }
  

  private getNearbyPlaces(): void {
    const hotelLatitude = this.hotel?.latitude;
    const hotelLongitude = this.hotel?.longitude;
  
    const overpassQuery = `
      [out:json];
      (
        node[shop](around:15000,${hotelLatitude},${hotelLongitude});
        node[tourism=beach](around:15000,${hotelLatitude},${hotelLongitude});
        node[natural=water](around:15000,${hotelLatitude},${hotelLongitude});
        node[leisure=park](around:15000,${hotelLatitude},${hotelLongitude});
        node[aeroway=aerodrome](around:15000,${hotelLatitude},${hotelLongitude});
        node[amenity=theatre](around:15000,${hotelLatitude},${hotelLongitude});
        node[amenity=place_of_worship][religion=hindu](around:15000,${hotelLatitude},${hotelLongitude});
        node[historic](around:15000,${hotelLatitude},${hotelLongitude});
        node[amenity=place_of_worship][religion=christian](around:15000,${hotelLatitude},${hotelLongitude});
      );
      out body;
    `;
  
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
    this.http.get(overpassUrl).subscribe((data: any) => {
      this.nearbyPlaces = this.categorizeAndLimitResults(data.elements);
      this.updateNearbyPlaceCategories();
    });
  }
  
  private updateNearbyPlaceCategories(): void {
    this.nearbyPlaceCategories = [
      { title: 'Landmarks', icon: 'fas fa-landmark', places: this.nearbyPlaces['landmarks'] },
      { title: 'Airports', icon: 'fas fa-plane-departure', places: this.nearbyPlaces['airports'] },
      { title: 'Shopping Places', icon: 'fas fa-shopping-cart', places: this.nearbyPlaces['shopping'] },
      { title: 'Parks', icon: 'fas fa-tree', places: this.nearbyPlaces['parks'] },
      { title: 'Theaters', icon: 'fas fa-theater-masks', places: this.nearbyPlaces['theaters'] },
      { title: 'Temples', icon: 'fas fa-place-of-worship', places: this.nearbyPlaces['temples'] },
      { title: 'Historical Places', icon: 'fas fa-monument', places: this.nearbyPlaces['historical'] },
      { title: 'Churches', icon: 'fas fa-church', places: this.nearbyPlaces['churches'] }
    ];

  }
  
  private categorizeAndLimitResults(elements: Place[]): { [key: string]: Place[] } {
    const categories: { [key: string]: Place[] } = {
      landmarks: [],
      airports: [],
      shopping: [],
      parks: [],
      theaters: [],
      temples: [],
      historical: [],
      churches: []
    };

    elements.forEach((element) => {
      const distance = this.calculateDistance(element);

      if (element.tags.shop && categories['shopping'].length < 2) {
        categories['shopping'].push({ ...element, distance });
      } else if ((element.tags.tourism === 'beach' || element.tags.natural === 'water') && categories['landmarks'].length < 2) {
        categories['landmarks'].push({ ...element, distance });
      } else if (element.tags.leisure === 'park' && categories['parks'].length < 2) {
        categories['parks'].push({ ...element, distance });
      } else if (element.tags.aeroway === 'aerodrome' && categories['airports'].length < 1) {
        categories['airports'].push({ ...element, distance });
      } else if (element.tags.amenity === 'theatre' && categories['theaters'].length < 2) {
        categories['theaters'].push({ ...element, distance });
      } else if (element.tags.amenity === 'place_of_worship' && element.tags.religion === 'hindu' && categories['temples'].length < 2) {
        categories['temples'].push({ ...element, distance });
      } else if (element.tags.historic && categories['historical'].length < 2) {
        categories['historical'].push({ ...element, distance });
      } else if (element.tags.amenity === 'place_of_worship' && element.tags.religion === 'christian' && categories['churches'].length < 1) {
        categories['churches'].push({ ...element, distance });
      }
    });

    return categories;
  }

  private calculateDistance(place: Place): number {
    const hotelLatitude = this.hotel?.latitude;
    const hotelLongitude = this.hotel?.longitude;

    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(place.lat - hotelLatitude);
    const dLon = this.deg2rad(place.lon - hotelLongitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(hotelLatitude)) * Math.cos(this.deg2rad(place.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getPlaceType(place: Place): string {
    if (place.tags.shop) return 'Shopping Place';
    if (place.tags.tourism === 'beach' || place.tags.natural === 'water') return 'Beach/Lake';
    if (place.tags.leisure === 'park') return 'Park';
    if (place.tags.aeroway === 'aerodrome') return 'Airport';
    if (place.tags.amenity === 'theatre') return 'Theatre';
    if (place.tags.amenity === 'place_of_worship' && place.tags.religion === 'hindu') return 'Temple';
    if (place.tags.historic) return 'Historical Place';
    if (place.tags.amenity === 'place_of_worship' && place.tags.religion === 'christian') return 'Church';
    return 'Unknown Place';
  }

  private populateDisplayPlaces(): void {
    this.nearbyPlaceCategories.forEach(category => {
      this.displayPlaces.push(...category.places.slice(0, 5));
    });
    
  }
  
  isPopupVisible: boolean = false;

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
  getIconForPlace(place: Place): string {
    if (this.nearbyPlaces['landmarks'].includes(place)) return 'fas fa-landmark';
    if (this.nearbyPlaces['airports'].includes(place)) return 'fas fa-plane-departure';
    if (this.nearbyPlaces['shopping'].includes(place)) return 'fas fa-shopping-cart';
    if (this.nearbyPlaces['parks'].includes(place)) return 'fas fa-tree';
    if (this.nearbyPlaces['theaters'].includes(place)) return 'fas fa-theater-masks';
    if (this.nearbyPlaces['temples'].includes(place)) return 'fas fa-place-of-worship';
    if (this.nearbyPlaces['historical'].includes(place)) return 'fas fa-monument';
    if (this.nearbyPlaces['churches'].includes(place)) return 'fas fa-church';
    return 'fas fa-map-marker-alt'; // Default icon if none match
  }
  scrollToAvailableRooms(): void {
    const element = document.getElementById('available-rooms-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  reserveRoom(roomType: any, rateOption: any): void {
    // Find the room group for the selected room type
  
    // Check if the room group was found and extract the room_group_id
    
      
    const hotelDetails = {
      hotelName: this.hotel.name,
      hotelRating: this.hotel.star_rating,
      hotelAddress: this.hotel.address,
      hotelImage: this.getImageUrl(this.images[0]),  // First image of the hotel
      roomType: roomType.key,  // Room type key
      roomSize: rateOption.roomDetails.size,  // Room size
      mealPlan: rateOption.rates[0].mealPlan,  // Meal plan
      cancellationPolicy: rateOption.rates[0].cancellationPolicy,  // Cancellation policy
      price: rateOption.rates[0].price,  // Room price
      currency: rateOption.rates[0].currency,  // Room currency
      hotel: this.hotelId,
      guests: this.guests,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      checkInTime: this.hotel?.check_in_time,  // Store check-in time
      checkOutTime: this.hotel?.check_out_time,  // Store check-out time
      adults: this.adults,
      children: this.children,
      childs: this.childs,
      roomGroupId: this.roomGroup.room_group_id,
      rg_id:this.roomGroup.rg_id,
      hotelId: this.hotel.id // Add room_group_id to the hotel details
    };
  
    // Store the hotelDetails in sessionStorage
    sessionStorage.setItem('hotelDetails', JSON.stringify(hotelDetails));
  
    // Navigate to the booking summary page
    this.router.navigate(['/reserve']);
  }
  
  fetchReviews(page: number, limit: number): void {
    this.loadingReviews = true;
    this.http.get<any>(`${environment.baseUrl}/reviews?hotelId=${this.hotelId}&page=${page}&limit=${limit}`)
      .subscribe({
        next: (response) => {
          const reviewsResponse = response.response;
          if (reviewsResponse) {
            // Append general reviews after user reviews
            this.reviews = [...this.reviews, ...reviewsResponse.data]; // Merge reviews
            this.totalReviews = reviewsResponse.total;
            this.totalPages = reviewsResponse.pages;
          }
          this.loadingReviews = false;
        },
        error: (error) => {
          console.error('Error fetching reviews:', error);
          this.loadingReviews = false;
        }
      });
  }
  getReviewsData(): void {
    const userReviewsObservable = this.http.get<any>(`${environment.baseUrl}/userreviews?hotelId=${this.hotelId}`);
  
    userReviewsObservable.subscribe((userReviewsResponse) => {
      const userReviews = userReviewsResponse.response?.userreviews || [];
      const userSpecificReviews = userReviewsResponse.response?.userspecificreviews || [];
      const detailedRatings = userReviewsResponse.response?.detailedratings || {};
      const hotelRating = userReviewsResponse.response?.detail_review_rating;
  
      // Combine the two sets of reviews
      const combinedReviews = [...userReviews, ...userSpecificReviews];
  
      // Remove duplicate reviews based on unique `id` property (ensure id comparison as strings)
      this.reviews = combinedReviews.filter(
        (review, index, self) => index === self.findIndex(r => String(r.id) === String(review.id))
      );
  
      // Store the first 3 reviews initially
      this.displayedReviews = this.reviews.slice(0, 3);
  
      // Store ratings or detailed ratings if needed
      this.detailedRatings = detailedRatings;
      this.hotelRating1 = hotelRating; // Use the hotel rating from the response
    });
  }
  
  // Method to toggle showing more or less reviews
  toggleReviews() {
    this.showAllReviews = !this.showAllReviews;
    
    if (this.showAllReviews) {
      // Show all reviews
      this.displayedReviews = this.reviews;
    } else {
      // Show only the first 3 reviews
      this.displayedReviews = this.reviews.slice(0, 3);
    }
  }

  // Button text changes depending on the state
  get toggleButtonText() {
    return this.showAllReviews ? 'Show Less' : 'Show More';
  }

  
// getStars(starRating: number): string {
//   let stars = '';
//   for (let i = 0; i < starRating; i++) {
//     stars += '';
//   }
//   for (let i = starRating; i < 5; i++) {
//     stars += '';
//   }
//   return stars;
// }  
  
  loadMoreReviews(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchReviews(this.page, this.limit);
    }
  }
}

