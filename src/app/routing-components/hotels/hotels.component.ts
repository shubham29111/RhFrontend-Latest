import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from 'src/environments/environments';
import { Hotel } from './hotel.model';
import staticFilters from './static-filters';
import { HotelService } from 'src/app/services/hotel.service';
import src from 'daisyui';
import { popup } from 'leaflet';
import {  ViewChild } from '@angular/core';
import { BookingPopupComponent } from 'src/app/shared-components/booking-popup/booking-popup.component';

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
  @ViewChild('comp') bookComponent:any
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
  currency: any 
  


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

  constructor(private route: ActivatedRoute, private http: HttpClient,private router:Router,private hotelService:HotelService
  ) {
 
  }

  showPopup(){
    this.isPopupVisible=true
  }
  hidePopup($event:any){
    this.isPopupVisible=$event
    console.log("This",this.bookComponent.isVisible,this.isPopupVisible)
    this.bookComponent.isVisible=false
    
    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.regionId = params['regionId'];
      this.region=params['location'];
      this.guests=params['guests'];
      this.checkIn=params['checkIn'];
      this.checkOut=params['checkOut'];
      this.currency =localStorage.getItem('currency') || null;
      this.isPopupVisible=false
      this.fetchHotels()

    });
    this.currency =localStorage.getItem('currency') || null;
    this.hotelService.getCurrencyDetailsObseravble().subscribe(
      (res)=>{
        console.log(res)
        if(res){
         
        this.isLoading=true
        this.currency=res
        this.fetchHotels()
        }
      
      }

    )
   

    
    
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
    this.http.get<any>(`${environment.baseUrl}/hotelsV1?regionId=${this.regionId}&currency=${this.currency}&checkIn=${this.checkIn}&checkOut=${this.checkOut}&adults=${this.guests}&${queryParams}`).subscribe(      (data) => {
        this.totalItems = data.response.total;
        console.log(data.response);
        
        this.hotels = this.manipulateHotelData(data.response.data);
        this.hotel = this.hotels.length > 0 ? this.hotels[0] : undefined;
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
    this.http.get<any>(`${environment.baseUrl}/hotelsV1/ptype?regionId=${this.regionId}&checkIn=${this.checkIn}&checkOut=${this.checkOut}&adults=${this.guests}${queryParams}`).subscribe(
      (data) => {
        this.updateFilterCounts(data.response);
      },
      (error) => {
        console.error('Error fetching filters', error);
      }
    );
  }
  buildQueryParams(includePagination: boolean): string {
    const params = new URLSearchParams();
    for (const key in this.selectedFilters) {
      if (this.selectedFilters[key].length) {
        let paramKey = key;
      if (paramKey === 'kind') {
        paramKey = 'propertyTypes';
      }
      else if(paramKey === 'room_amenity')
      {
        paramKey='inRoom';
      }
      else if(paramKey === 'serp_name')
      {
        paramKey='serpNames';
      }
      else if(paramKey==='star_rating')
      {
        paramKey='starRatings'
        const starNumbers = this.selectedFilters[key].map(star => this.convertStarSymbolsToNumbers(star));
        params.append(paramKey, JSON.stringify(starNumbers));
        continue;
      }
     
      if (this.selectedFilters[key].length) {
        params.append(paramKey, JSON.stringify(this.selectedFilters[key]));
        console.log(`${paramKey}: ${JSON.stringify(this.selectedFilters[key])}`); 
      }
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
        if (img) {
          return img.replace('{size}', '640x400');
        } else {
          console.warn(`Image is undefined or empty for hotel at index ${index}`, hotel);
          return placeholderImage;
        }
      });
    } else {
      console.warn(`Hotel images are undefined or empty for hotel at index ${index}`, hotel);
      images = [placeholderImage];
    }

    return {
      ...hotel,
      images: images.length > 0 ? images : [placeholderImage],
      currentImageIndex: 0,
      id: index
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
      this.initMap()
    } 
   

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
  
}