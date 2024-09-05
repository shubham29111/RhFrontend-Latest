import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
   getCurrencyDetails=new BehaviorSubject<any>(null)
  
  constructor(private http:HttpClient) { }

  setCurrencyDetails(currency:string){
     this.getCurrencyDetails.next(currency)
  }
  getCurrencyDetailsObseravble():Observable<any>{
    return this.getCurrencyDetails.asObservable()
  }


  getCountry(latitude:number,longitude:number){
    var api_url = 'https://api.opencagedata.com/geocode/v1/json'
    var api_key = 'e53fa3f53610419fa192a08bd7055ad3';

    // reverse geocoding example (coordinates to address)
    var query = latitude + ',' + longitude;
    var request_url = api_url
      + '?'
      + 'key=' + api_key
      + '&q=' + encodeURIComponent(query)
      + '&pretty=1'
      + '&no_annotations=1';
    return this.http.get(request_url)
  }

  getCountryCurrency(countryCode:string){
    return this.http.get(`https://restcountries.com/v3.1/alpha/${countryCode}`)
  }

  getHotels() {
    return [
        {
            id: 1,
            name: 'Park Central Hotel New York',
            location: '870 7th Ave, New York',
            distance: '3.8 km from the New York center',
            price: 236,
            rating: 8,
            reviews: 8892,
            imageUrl: 'https://via.placeholder.com/400x200?text=Hotel+1',
            coordinates: { lat: 40.7648, lng: -73.9808 }
          },
          {
            id: 2,
            name: 'The Manhattan at Times Square Hotel',
            location: '790 7th Ave, New York',
            distance: '3.5 km from the New York center',
            price: 207,
            rating: 7,
            reviews: 12911,
            imageUrl: 'https://via.placeholder.com/400x200?text=Hotel+2',
            coordinates: { lat: 40.7590, lng: -73.9845 }
          }
      // Add more hotels as needed
    ];
  }
}
