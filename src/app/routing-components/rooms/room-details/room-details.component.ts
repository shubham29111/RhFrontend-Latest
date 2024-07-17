import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookedService } from 'src/app/services/bookedApi.service';
import { RoomsService } from 'src/app/services/roomsApi.service';

@Component({
  selector: 'app-room-details',
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private roomsApi: RoomsService, private bookedApi: BookedService) { }

  room: any;
  roomId: any;
  imageId: number = 0
  postForm!: FormGroup;

  ngOnInit(): void {
    this.detailedRoom()
    this.formData()
    
    
  }

  detailedRoom() {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('id');
    this.roomsApi.getRooms().subscribe((res) => {
      this.room = res.find((item: any) => item.id == this.roomId)
      console.log(this.room.images.length);

    })
  }

  backImg() {
    this.imageId--

    if (this.imageId < 0) { this.imageId = this.room.images.length - 1 }
  }

  nextImg() {
    this.imageId++

    if (this.imageId > this.room.images.length - 1) { this.imageId = 0 }

  }




formData() {
  this.postForm = new FormGroup({
    checkIn: new FormControl("", Validators.required),
    checkOut: new FormControl("", Validators.required),
    userName: new FormControl("", Validators.required),
    userPhone: new FormControl("", Validators.required,),
  })
}

postCustomRoom() {
  this.bookedApi.postRoom(
    {
      "id": 0,
      "roomID": this.roomId,
      "checkInDate": this.postForm.controls['checkIn'].value,
      "checkOutDate": this.postForm.controls['checkOut'].value,
      "totalPrice": 0,
      "isConfirmed": true,
      "customerName": this.postForm.controls['userName'].value,
      "customerId": "string",
      "customerPhone": this.postForm.controls['userPhone'].value
    }
  ).subscribe()
}


}
