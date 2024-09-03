import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as L from 'leaflet';
import { flatMap } from 'rxjs';

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

@Component({
  selector: 'app-hotel-rooms',
  templateUrl: './hotel-rooms.component.html',
  styleUrls: ['./hotel-rooms.component.css'],
  providers: [DatePipe]
})
export class HotelRoomsComponent implements OnInit, AfterViewInit {

  hotel: any;
  rooms: any[] = [];
  reviews: any = null;
  images: string[] = [];
  selectedImageUrl: string = '';
  isModalOpen: boolean = false;
  loading:boolean=false
  hotelId: string = '';
  hotelPrice: any;
  guests: any;
  checkIn: any;
  checkOut: any;
  checkInHour: number = 0;
  checkOutHour: number = 0;
  availablePercentage: number = 0;
  map: any;
  hotelLatitude: number = 0;
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

  imageList = [
    {
      height: 683,
      src: "https://cdn.worldota.net/t/{size}/content/16/69/16696eaf876017daff4b6f86185e00f4bb57fcf5.jpeg",
      width: 1024
    },
    {
      height: 683,
      src: "https://cdn.worldota.net/t/{size}/content/a1/d1/a1d19f66417383095f2cb112997ef36a91f58ea1.jpeg",
      width: 1024
    },
    {
      "height": 683,
      "src": "https://cdn.worldota.net/t/{size}/content/a1/d1/a1d19f66417383095f2cb112997ef36a91f58ea1.jpeg",
      "src_secure": "https://cdn.worldota.net/t/{size}/content/a1/d1/a1d19f66417383095f2cb112997ef36a91f58ea1.jpeg",
      "width": 1024
  },
  {
      "height": 683,
      "src": "https://cdn.worldota.net/t/{size}/content/b3/4b/b34b4ee519eaf54a60b941695da2c7645ce7eebe.jpeg",
      "src_secure": "https://cdn.worldota.net/t/{size}/content/b3/4b/b34b4ee519eaf54a60b941695da2c7645ce7eebe.jpeg",
      "width": 1024
  },
  {
      "height": 683,
      "src": "https://cdn.worldota.net/t/{size}/content/5e/b1/5eb139203d4d35604e496caec1a9ddab84e6f334.jpeg",
      "src_secure": "https://cdn.worldota.net/t/{size}/content/5e/b1/5eb139203d4d35604e496caec1a9ddab84e6f334.jpeg",
      "width": 1024
  },
  {
      "height": 683,
      "src": "https://cdn.worldota.net/t/{size}/content/af/e5/afe5b36176afa78bf90ca8935ed44ede933f8a6f.jpeg",
      "src_secure": "https://cdn.worldota.net/t/{size}/content/af/e5/afe5b36176afa78bf90ca8935ed44ede933f8a6f.jpeg",
      "width": 1024
  },
  {
      "height": 683,
      "src": "https://cdn.worldota.net/t/{size}/content/c8/b3/c8b30c199408ea8c153aa275f2e45558a8001fd6.jpeg",
      "src_secure": "https://cdn.worldota.net/t/{size}/content/c8/b3/c8b30c199408ea8c153aa275f2e45558a8001fd6.jpeg",
      "width": 1024
  },
  {
      "height": 683,
      "src": "https://cdn.worldota.net/t/{size}/content/2b/14/2b14d391b6e1a6559509521257c5603f56374ecf.jpeg",
      "src_secure": "https://cdn.worldota.net/t/{size}/content/2b/14/2b14d391b6e1a6559509521257c5603f56374ecf.jpeg",
      "width": 1024
  }
    // Add the remaining images here
  ];
  constructor(private datePipe: DatePipe, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hotelId = params['hotel'];
      this.hotelPrice = params['hotelPrices'];
      this.guests = params['guests'];
      const checkInDate = new Date(params['checkIn']);
      const checkOutDate = new Date(params['checkOut']);
      this.checkIn = this.datePipe.transform(checkInDate, 'dd MMM yyyy, EEE');
      this.checkOut = this.datePipe.transform(checkOutDate, 'dd MMM yyyy, EEE');
    });
    this.getHotelData();
    this.getReviewsData();
  }

  ngAfterViewInit(): void {
    // this.initMap();
    // this.getNearbyPlaces();
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
        this.loading=false;

        this.calculateHours();
        this.hotelLatitude = this.hotel?.latitude;
        this.hotelLongitude = this.hotel?.longitude;
        this.getNearbyPlaces();
        this.initMap();
    // this.getNearbyPlaces();


      });
  }

  getReviewsData(): void {
    this.http.get(environment.baseUrl + '/userreviews?hotelId=' + this.hotelId)
      .subscribe((response: any) => {
        this.reviews = response.response;
      });
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

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
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
    console.log(this.displayPlaces);
    
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
  
}
