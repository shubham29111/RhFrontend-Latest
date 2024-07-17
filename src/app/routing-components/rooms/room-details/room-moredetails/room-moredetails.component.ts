import { Component } from '@angular/core';

@Component({
  selector: 'app-room-moredetails',
  templateUrl: './room-moredetails.component.html',
  styleUrls: ['./room-moredetails.component.css']
})
export class RoomMoredetailsComponent {

  tab: string = "";


  onOverViewClick() {
    this.tab = "overview"
  }
  onFacilitiesClick() {
    this.tab = "facilities"
  }
  onExtraClick() {
    this.tab = "extra"
  }

}
