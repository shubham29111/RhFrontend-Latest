import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookedService } from 'src/app/services/bookedApi.service';
import { HotelsService } from 'src/app/services/hotelsApi.service';

@Component({
  selector: 'app-booked-rooms',
  templateUrl: './booked-rooms.component.html',
  styleUrls: ['./booked-rooms.component.css']
})
export class BookedRoomsComponent implements OnInit {
  constructor (private bookedHttpServ: BookedService, private hotel: HotelsService ) {}

  table: any = []



  ngOnInit(): void {
    this.getBookedRooms()
    console.log(this.table.id);
    
    
  }

 


  getBookedRooms() {
    return this.bookedHttpServ.getRooms().subscribe({
      next: ((res) => this.table = res)
    })
  }

  cancelBooking(id:any) {
    return this.bookedHttpServ.deleteRoom(id).subscribe(
      {
        next: (res) => alert(res),
        error:(err) => alert(err.error),
        
        
      }
    )
  }

}
