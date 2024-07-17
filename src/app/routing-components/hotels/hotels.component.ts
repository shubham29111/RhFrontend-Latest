import { Component, OnInit } from '@angular/core';
import { HotelsService } from 'src/app/services/hotelsApi.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {
  constructor(private hotelApiHttp: HotelsService) {}

 hotels: any = []


 ngOnInit(): void {
   this.getAllHotels()
 }

 getAllHotels() {
  this.hotelApiHttp.getHotels().subscribe({
    next: (res) => this.hotels = res
  })
 }

}
