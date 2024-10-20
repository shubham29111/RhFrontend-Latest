import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { Hotel } from './hotel.model';
import staticFilters from './static-filters';
import { HotelService } from 'src/app/services/hotel.service';

import {  ViewChild } from '@angular/core';
import { BookingPopupComponent } from 'src/app/shared-components/booking-popup/booking-popup.component';
import { SharedService } from 'src/app/services/shared-service/shared.service';
import { NotificationComponent } from '../notification/notification.component';

interface FilterItem {
  type: string | null;
  category: string;
  count: string;
}

interface Technology {
  name: string;
  id: string;
  count: string;
}

interface FilterGroup {
  groupName: string;
  category: string;
  technologies?: Technology[];
  subGroups?: { subGroupName: string; technologies: Technology[] }[];
}
declare var google: any;

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  currentPage:number=1
  @ViewChild('comp') bookComponent:any;
  @ViewChild(NotificationComponent) notificationComponent!: NotificationComponent;

  isPopupVisible=false
  itemsPerPage: number=5
  totalItems: number=0
  hotels: Hotel[] = [];
  hotel: Hotel | undefined;
  regionId: any = [];
  regionName: string = '';
  region:string='';
  showMap: boolean = false;
  loading: boolean = false;
  isLoading = false;
  allImagesLoaded: boolean = false;
  filters: FilterGroup[] = staticFilters;
  loaders: number[] = Array(10).fill(0);
  currentImageIndex: number = 0;
  map: any;
  showFilterModal: boolean = false;
  showMapModal: boolean = false;
  selectedOption: string = 'Price (high to low)';
  dropdownOpen: boolean = false;
  pagination:any
  paginationData:any
  guests:any;
  checkIn:any;
  checkOut:any;
  childs:any;
  adults:any;
  childrens:any;
  rooms:any;
  markers: { [hotelId: string]: any } = {};
  options: string[] = [
    'popularity',
    'Price (low to high)',
    'Price (high to low)',
    'Closest to the city center first',
    'Guests\' rating (high to low)'
  ];
  selectedFilters: { [key: string]: string[] } = {
    kind: [],
    star_rating: [],
    serp_name: [],
    payment_method: [],
    room_amenity: []
  };
  currency: any ;
  
  


  private amenityIcons: { [key: string]: string } = {
    'air_conditioning': 'fa-snowflake',
    'has_airport_transfer': 'fa-plane',
    'has_business': 'fa-briefcase',
    'has_disabled_support': 'fa-wheelchair',
    'has_fitness': 'fa-dumbbell',
    'has_internet': 'fa-wifi',
    'has_kids': 'fa-child',
    'has_meal': 'fa-utensils',
    'has_parking': 'fa-parking',
    'has_pool': 'fa-swimmer',
    'has_spa': 'fa-spa',
    'kitchen': 'fa-kitchen-set'
  };
  userData: any;

  constructor(private shardeService:SharedService ,private route: ActivatedRoute, private http: HttpClient,private router:Router,private hotelService:HotelService
  ) {
 
  }


  hidePopup() {
    this.isPopupVisible = false;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.regionId = params['regionId'];
      this.region = params['location'];
      this.guests = params['guests'];
      this.checkIn = params['checkIn'];
      this.checkOut = params['checkOut'];
      this.childs = params['totalChildren'];
      this.adults = params['totalAdults'];
      this.childrens = params['childrenAges'] || [];
      this.rooms = params['rooms'];
      this.currency = localStorage.getItem('currency') || "USD";
      this.isPopupVisible = false;
      this.fetchHotels();
      this.loadFilters();
    });
  
    this.currency = localStorage.getItem('currency') || "USD";
    
    // Subscribe to currency changes
    this.hotelService.getCurrencyDetailsObseravble().subscribe(
      (res) => {
        if (res) {
          this.isLoading = true;
          this.currency = res;
          this.fetchHotels();
        }
      }
    );
  
    // Check if the user is logged in
    this.userData = sessionStorage.getItem('user');
    
    if (this.userData) {
      // User is logged in, retrieve liked hotels from localStorage
      const storedLikes = JSON.parse(localStorage.getItem('likedHotels') || '[]');
      if (storedLikes.length > 0) {
        // Send the liked hotels to the API one by one
        this.sendStoredLikesToApi(storedLikes);
      }
    } else {
      // User is not logged in, clear the liked hotels from localStorage
      localStorage.removeItem('likedHotels');
    }
  }
  
  ngAfterViewInit(): void {
    if (typeof google !== 'undefined') {
      this.initMap();
    } else {
      console.error('Google Maps API not loaded');
    }
  }
  
  
  fetchHotels() {
    this.isLoading = true; 
    const queryParams = this.buildQueryParams(true);
    this.userData = sessionStorage.getItem('user');
    let userIdParam = '';
    
    if (this.userData) {
      // Parse the user data to extract the userId
      const user = JSON.parse(this.userData);
      userIdParam = `&userId=${user.userId}`;
    } else {
     
      console.log('User not logged in, opening login dropdown');
   
    }
    
    // Make the GET request with the userId only if it's available
    this.http.get<any>(`${environment.baseUrl}/hotelsV1?regionId=${this.regionId}&currency=${this.currency}&checkIn=${this.checkIn}&checkOut=${this.checkOut}&adults=${this.adults}&children=[${this.childrens}]&${queryParams}${userIdParam}`).subscribe(
      (data) => {
        this.totalItems = data.response.total;
        console.log(data.response);
        
        this.hotels = this.manipulateHotelData(data.response.data);
        this.hotel = this.hotels.length > 0 ? this.hotels[0] : undefined;
        console.log(this.hotel);
        
        this.regionName = this.hotel ? this.hotel.region_name : 'No region found';
        console.log(this.hotels);
        this.pagination=this.paginate()
        console.log(this.pagination)
    this.paginationData=this.hotels.slice(
      this.pagination.startIndex,this.pagination.lastIndex
    )

        this.isLoading = false; 
        this.preloadImages();
      },
      (error) => {
        console.error('Error fetching hotels', error);
        this.loading = false;
      }
    );
  }
   loadFilters() {
    console.log(this.currency)
    const queryParams = this.buildQueryParams(false);
    this.http.get<any>(`${environment.baseUrl}/hotelsV1/ptype?regionId=${this.regionId}&checkIn=${this.checkIn}&checkOut=${this.checkOut}&adults=${this.adults}&children=[${this.childrens}]&${queryParams}`).subscribe(
      (data) => {
        this.updateFilterCounts(data.response);
      },
      (error) => {
        console.error('Error fetching filters', error);
      }
    );
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  buildQueryParams(includePagination: boolean): string {
    const params = new URLSearchParams();
    for (const key in this.selectedFilters) {
        if (this.selectedFilters[key].length) {
            let paramKey = key;
            // Convert values to lowercase and replace spaces with underscores
            const formattedValues = this.selectedFilters[key].map(value => value.toLowerCase().replace(/\s+/g, '_'));
            
            if (paramKey === 'kind') {
                paramKey = 'propertyTypes';
            } else if (paramKey === 'room_amenity') {
                paramKey = 'inRoom';
            } else if (paramKey === 'serp_name') {
                paramKey = 'serpNames';
            } else if (paramKey === 'star_rating') {
                paramKey = 'starRatings';
                const starNumbers = formattedValues.map(star => this.convertStarSymbolsToNumbers(star));
                params.append(paramKey, JSON.stringify(starNumbers));
                continue;
            }

            params.append(paramKey, JSON.stringify(formattedValues));
            console.log(`${paramKey}: ${JSON.stringify(formattedValues)}`); 
        }
    }    
    if (includePagination) {
        params.append('page', this.currentPage.toString());
        params.append('limit', String(10));
    }
    return `${params.toString()}`;
}
  convertStarSymbolsToNumbers(starSymbol: string): number {
    const starNumber= starSymbol.replace(/[^⭐️]/g, '').length
    return starNumber/2;
  }
  onFilterChange(category: string, value: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;
  
    if (checked) {
      this.selectedFilters[category].push(value);
    } else {
      const index = this.selectedFilters[category].indexOf(value);
      if (index > -1) {
        this.selectedFilters[category].splice(index, 1);
      }
    }
    this.fetchHotels();
    this.loadFilters();
  }
  

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchHotels();
    }
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.fetchHotels();
    }
  }

  manipulateHotelData(hotels: any[]): Hotel[] {
    if (!Array.isArray(hotels)) {
      console.error('Expected hotels to be an array, but got:', hotels);
      return [];
    }
  
    return hotels.map((hotel, index) => {
      const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019';
      
      let images: string[] = [];
      if (Array.isArray(hotel.images) && hotel.images.length > 0) {
        images = hotel.images.slice(0, 10).map((img: string) => {
          return img ? img.replace('{size}', '640x400') : placeholderImage;
        });
      } else {
        images = [placeholderImage];
      }
  
      // Return the hotel data including the isliked status
      return {
        ...hotel,
        images: images.length > 0 ? images : [placeholderImage],
        currentImageIndex: 0,
        isliked: hotel.isliked // Ensure isliked is passed to the object
      };
    });
  }
  
  
  setView(view: string) {
    this.showMap = view === 'map';
  }

  isMapVisible = false;

  toggleMap() {
    this.isMapVisible = !this.isMapVisible;
    const mapOverlay = document.getElementById('mapOverlay') as HTMLDivElement;
    const hotelListing = document.getElementById('hotelListing') as HTMLDivElement;
    const hotelAddress = document.querySelectorAll('.hotel-address') as NodeListOf<HTMLParagraphElement>;
    const hotelName = document.querySelectorAll('.hotel-name') as NodeListOf<HTMLHeadingElement>;
    const hotelCards = document.querySelectorAll('.hotelcard') as NodeListOf<HTMLDivElement>;
    const hotelAmenities = document.querySelectorAll('.hotel-amenities') as NodeListOf<HTMLDivElement>;


    if (this.isMapVisible) {
      mapOverlay.classList.add('show');
      hotelListing.classList.add('shrink');
      hotelAddress.forEach(hotelAddres => hotelAddres.classList.add('hidee'));
      hotelName.forEach(hotelNam => hotelNam.classList.add('text-header'));
      hotelCards.forEach(hotelCard => hotelCard.classList.add('compact'));
      hotelAmenities.forEach(hotelAmenitie => hotelAmenitie.classList.add('hidee'));

    } 
    this.initMap()

  }
  listView()
  { 
    this.isMapVisible = false;

    const mapOverlay = document.getElementById('mapOverlay') as HTMLDivElement;
    const hotelListing = document.getElementById('hotelListing') as HTMLDivElement;
    const hotelAddress = document.querySelectorAll('.hotel-address') as NodeListOf<HTMLParagraphElement>;
    const hotelName = document.querySelectorAll('.hotel-name') as NodeListOf<HTMLHeadingElement>;
    const hotelCards = document.querySelectorAll('.hotelcard') as NodeListOf<HTMLDivElement>;
    const hotelAmenities = document.querySelectorAll('.hotel-amenities') as NodeListOf<HTMLDivElement>;

    if (!this.isMapVisible) {
      mapOverlay.classList.remove('show');
      hotelListing.classList.remove('shrink');
      hotelAddress.forEach(hotelAddres => hotelAddres.classList.remove('hidee'));
      hotelName.forEach(hotelNam => hotelNam.classList.remove('text-header'));
      hotelCards.forEach(hotelCard => hotelCard.classList.remove('compact'));
      hotelAmenities.forEach(hotelAmenitie => hotelAmenitie.classList.remove('hidee'));
    }
    
  }


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sort-by')) {
      this.dropdownOpen = false;
    }
  }

  preloadImages() {
    let index = 0;
    const loadNextImage = () => {
      if (index < this.hotels.length) {
        const hotel = this.hotels[index];
        this.loadImage(hotel.images[hotel.currentImageIndex]).then(() => {
          index++;
          setTimeout(loadNextImage, 200); 
        });
      }
    };
    loadNextImage();
  }
  
  loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => reject();
    });
  }

  nextImage(hotelId: string): void {
    const hotel = this.hotels.find(h => h.id === hotelId);
    if (hotel) {
      hotel.currentImageIndex = (hotel.currentImageIndex + 1) % hotel.images.length;
    }
  }

  prevImage(hotelId: string): void {
    const hotel = this.hotels.find(h => h.id === hotelId);
    if (hotel) {
      hotel.currentImageIndex = (hotel.currentImageIndex - 1 + hotel.images.length) % hotel.images.length;
    }
  }
 
  initMap() {
    console.log(this.hotels);
  
    if (!this.hotels || this.hotels.length === 0) {
      console.warn('No hotels to display on the map');
      return;
    }
  
    const mapCenter = this.getMapCenter();
  
    const styledMapType = new google.maps.StyledMapType(
      [
        {
          "featureType": "poi.business",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.medical",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.park",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.place_of_worship",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.school",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi.sports_complex",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "transit.station",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [{ "visibility": "off" }]
        }
      ],
      { name: 'Styled Map' }
    );
  
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      zoom: 10,
      center: mapCenter,
      mapTypeControlOptions: {
        mapTypeIds: ['styled_map']
      }
    });
  
    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');
  
    if (!this.markers) {
      this.markers = {};
    }
  
    // Loop through the hotels and create markers for each
    this.hotels.forEach(hotel => {
      const marker = new google.maps.Marker({
        position: { lat: hotel.latitude, lng: hotel.longitude },
        map: this.map,
        title: hotel.name
      });
  
      this.markers[hotel.hotel_id] = marker;
    });
    this.addMarkers()
    this.addCityCenterMarker(mapCenter);
  }
  
  
  
  getMapCenter() {
    if (this.hotels.length === 1) {
      return { lat: this.hotels[0].latitude, lng: this.hotels[0].longitude };
    }
    const latSum = this.hotels.reduce((sum, hotel) => sum + hotel.latitude, 0);
    const lngSum = this.hotels.reduce((sum, hotel) => sum + hotel.longitude, 0);
    return { lat: latSum / this.hotels.length, lng: lngSum / this.hotels.length };
  }
  
  addMarkers() {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }
  
    this.hotels.forEach(hotel => {
      if (hotel.latitude && hotel.longitude) {
        const marker = new google.maps.Marker({
          position: { lat: hotel.latitude, lng: hotel.longitude },
          map: this.map,
          title: hotel.name
        });
  
        const contentString = `
        <div style="width: 200px; height: 100px;">
          <h3 style="margin: 0; font-size: 16px;">${hotel.name}</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Price: ${hotel.price}</strong></p>
          <img src="${hotel.images[0]}" alt="${hotel.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });
      
      marker.addListener('mouseover', () => {
        infoWindow.open(this.map, marker);
      });
      
      marker.addListener('mouseout', () => {
        infoWindow.close();
      });
      
      } else {
        console.warn(`Hotel ${hotel.name} does not have valid latitude/longitude`);
      }
    });
  }
  
  
  // Method to add a flag at the city center and zoom in on it
  addCityCenterMarker(center: { lat: number, lng: number }) {
    if (!this.map) {
      console.error('Map is not initialized');
      return;
    }
  
    const cityCenterMarker = new google.maps.Marker({
      position: center,
      map: this.map,
      title: 'City Center',
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/flag.png', 
        scaledSize: new google.maps.Size(32, 32) 
      }
    });
  
    this.map.setZoom(12); 
  
    const infoWindow = new google.maps.InfoWindow({
      content: '<b>City Center</b>'
    });
  
    cityCenterMarker.addListener('click', () => {
      infoWindow.open(this.map, cityCenterMarker);
    });
  
    // Optionally, pan to the center marker to ensure it is in view
    this.map.panTo(center);
  }
  
  
  formatAmenity(amenity: string): string {
    if (!amenity) return amenity;
    let formattedValue = amenity.replace(/_/g, ' ');
    return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
  }
  getAmenityIcon(amenity: string): string {
    return this.amenityIcons[amenity] || 'No Amenity'; 
  }

  createFilterMap(apiResponse: FilterItem[]): Record<string, FilterItem[]> {
    const filters: Record<string, FilterItem[]> = {};
    apiResponse.forEach(item => {
      if (!filters[item.category]) {
        filters[item.category] = [];
      }
      filters[item.category].push(item);
    });
    return filters;
  }

  formatName(name: string | null): string {
    if (name === null) return '';
    if (name === '0') return '0';
    if (name.match(/^\d+$/)) return '⭐️'.repeat(Number(name));
    return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  updateFilterCounts(apiResponse: FilterItem[]) {
    const filterMap = this.createFilterMap(apiResponse);

    this.filters.forEach(group => {
      group.technologies?.forEach(tech => {
        const count = filterMap[group.category]?.find(item => this.formatName(item.type) === tech.name)?.count || '';
        tech.count = count === '0' ? '' : count;
      });
    });
  }

  showAllRooms(hotelId: any, hotelPrice: any) {
    this.router.navigate(['/hotelrooms'], { 
      queryParams: { 
        hotel: hotelId,
        hotelPrices: hotelPrice ,
        guests:this.guests,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        adults:this.adults,
        children:this.childrens,
        childs:this.childs,
      }
    });
  }
  
  
  @HostListener('mouseover', ['$event.target'])
  onMouseOver(target: HTMLElement) {
    if (target.classList.contains('hotelcard')) {
      const hotelId = target.getAttribute('data-hotel-id');
      if (hotelId && this.markers[hotelId] && this.map) {
        this.map.panTo(this.markers[hotelId].getPosition());
        this.map.setZoom(15); // Optional: Zoom in to give a closer look
      }
    }
  }

  onPageChange($event:any){
    this.currentPage = $event;
    this.pagination=this.paginate()
    this.paginationData=this.hotels.slice(
      this.pagination.startIndex,this.pagination.lastIndex
    )
  }
  paginate() {
    return {
      startIndex: (this.currentPage - 1) * this.itemsPerPage,
      lastIndex: (this.currentPage - 1) * this.itemsPerPage + this.itemsPerPage,
    };
  }
  toggleLike(hotelId: string, currentLikeStatus: boolean) {
    const hotel = this.hotels.find(h => h.hotel_id === hotelId);
    if (hotel) {
      // Toggle the like status in the UI
      hotel.isliked = !currentLikeStatus;
  
      // Check if the user is logged in
      this.userData = sessionStorage.getItem('user');
      
      if (!this.userData) {
        // User not logged in, show alert and store the liked hotel in localStorage
        let storedLikes = JSON.parse(localStorage.getItem('likedHotels') || '[]');
        
        if (hotel.isliked) {
          const hotelData = { hotelId: hotelId, regionId: this.regionId };
          if (!storedLikes.some((item: any) => item.hotelId === hotelId)) {
            storedLikes.push(hotelData);
          }
        } else {
          storedLikes = storedLikes.filter((item: any) => item.hotelId !== hotelId);
        }
  
        localStorage.setItem('likedHotels', JSON.stringify(storedLikes));
        
        // Show the notification alert for non-logged-in users
        this.notificationComponent.showAlert('To save hotels to your favorites, please log in.');
        return;
      }
  
      // If the user is logged in, send the like/unlike request to the API
      const requestBody = {
        hotelId: hotel.hotel_id,
        regionId: Number(this.regionId),
        isLike: hotel.isliked
      };
  
      const user = JSON.parse(this.userData);
  
      const headers = new HttpHeaders({
        Authorization: `Bearer ${user.token}`,
      });
  
      this.http.post(`${environment.baseUrl}/favorites`, requestBody, { headers })
        .subscribe(
          response => {
            console.log('Like status updated successfully:', response);
          },
          error => {
            console.error('Error updating like status:', error);
            hotel.isliked = currentLikeStatus;
          }
        );
    }
  }
  
  

  sendStoredLikesToApi(storedLikes: any[]) {
    if (!this.userData) return;
  
    // Parse the user data to extract the token
    const user = JSON.parse(this.userData);
  
    // Define the headers with the token for authorization
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });
  
    // Iterate over stored likes and send them one by one
    storedLikes.forEach((like, index) => {
      const requestBody = {
        hotelId: like.hotelId,
        regionId: like.regionId,
        isLike: true
      };
  
      // Send POST request for each liked hotel
      this.http.post(`${environment.baseUrl}/favorites`, requestBody, { headers })
        .subscribe(
          response => {
            console.log(`Like for hotel ID ${like.hotelId} sent successfully:`, response);
            
            // After successfully sending the like, remove it from the local storage array
            storedLikes.splice(index, 1);
  
            // Update localStorage with the remaining likes
            localStorage.setItem('likedHotels', JSON.stringify(storedLikes));
  
            // If all likes have been sent, clear localStorage
            if (storedLikes.length === 0) {
              localStorage.removeItem('likedHotels');
            }
          },
          error => {
            console.error(`Error sending like for hotel ID ${like.hotelId}:`, error);
          }
        );
    });
  }
  
  
  
}