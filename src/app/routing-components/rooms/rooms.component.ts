import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { RoomsService } from 'src/app/services/roomsApi.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  hotel: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getHotelData();
  }

  getHotelData(): void {
    this.http.get(environment.baseUrl+'/hotels/hotel_ocean_residency')
      .subscribe((response: any) => {
        this.hotel = response.response;
      });
  }
}