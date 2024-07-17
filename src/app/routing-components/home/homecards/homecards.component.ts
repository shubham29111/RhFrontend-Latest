import { Component } from '@angular/core';


interface Place {
  imageSrc: string;
  country: string;
  city: string;
  link: string;
}

@Component({
  selector: 'app-homecards',
  templateUrl: './homecards.component.html',
  styleUrls: ['./homecards.component.css']
})
export class HomecardsComponent {
    allPlaces: Place[] = [
      {
        imageSrc: 'https://cdn.worldota.net/t/x220/ostrota_mainpage/0e/f6/0ef6f230165e2e5531a234a3a8fee992c01f6e1f.jpeg',
        country: 'United Arab Emirates',
        city: 'Hotels in Dubai',
        link: 'https://example.com/dubai'
      },
      {
        imageSrc: 'https://cdn.worldota.net/t/x220/ostrota_mainpage/36/b9/36b9729a26298ddbb866965d6c988ad7524a37b4.jpeg',
        country: 'United States of America',
        city: 'Hotels in New York',
        link: 'https://example.com/newyork'
      },
      {
        imageSrc: 'https://cdn.worldota.net/t/x220/ostrota_mainpage/69/ee/69ee8ec2e5b38692284c67de958211feb0043064.jpeg',
        country: 'United States of America',
        city: 'Hotels in Las Vegas',
        link: 'https://example.com/lasvegas'
      },
      {
        imageSrc: 'https://cdn.worldota.net/t/x220/ostrota_mainpage/36/b9/36b9729a26298ddbb866965d6c988ad7524a37b4.jpeg',
        country: 'Türkiye',
        city: 'Hotels in Alanya',
        link: 'https://example.com/alanya'
      },
      {
        imageSrc: 'https://cdn.worldota.net/t/x220/ostrota_mainpage/0c/24/0c24c13da09c4f1d073d3320c1aeca436f260611.jpeg',
        country: 'Türkiye',
        city: 'Hotels in Istanbul',
        link: 'https://example.com/istanbul'
      },
      {
        imageSrc: 'https://cdn.worldota.net/t/x220/ostrota_mainpage/e2/87/e2877b3fba343aeccf884af931eb47e4f6cedc19.jpeg',
        country: 'United States of America',
        city: 'Hotels in Orlando',
        link: 'https://example.com/orlando'
      },
      {
        imageSrc: 'https://example.com/paris.jpg',
        country: 'France',
        city: 'Hotels in Paris',
        link: 'https://example.com/paris'
      }
    ];
  
    places: Place[] = [];
    isLoading = false;
    placesLoaded = 0;
  
    constructor() { }
  
    ngOnInit(): void {
      this.loadMorePlaces();
    }
  
    loadMorePlaces(): void {
      this.isLoading = true;
      setTimeout(() => {
        const nextBatch = this.allPlaces.slice(this.placesLoaded, this.placesLoaded + 3);
        this.places = this.places.concat(nextBatch);
        this.placesLoaded += 3;
        this.isLoading = false;
      }, 1000);
    }
  
    isMoreDataAvailable(): boolean {
      return this.placesLoaded < this.allPlaces.length;
    }
  }