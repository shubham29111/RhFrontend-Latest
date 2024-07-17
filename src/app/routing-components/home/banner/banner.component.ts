import { Component } from '@angular/core';

interface Room {
  adults: number;
  children: number;
}

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {


  isGuestsDropdownVisible: boolean = false;
  rooms: Room[] = [{ adults: 1, children: 0 }];

  toggleGuestsDropdown() {
    this.isGuestsDropdownVisible = !this.isGuestsDropdownVisible;
  }

  decreaseAdults(index: number) {
    if (this.rooms[index].adults > 1) {
      this.rooms[index].adults--;
    }
  }

  increaseAdults(index: number) {
    this.rooms[index].adults++;
  }
  increaseChildren(index: number) {
    this.rooms[index].children++;
  }

  decreaseChildren(index: number) {
    if (this.rooms[index].children > 0) {
      this.rooms[index].children--;
    }
  }
  addRoom() {
    this.rooms.push({ adults: 1, children: 0 });
  }

  removeRoom(index: number) {
    this.rooms.splice(index, 1);
  }
  getGuestsPlaceholder() {
    const totalAdults = this.rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = this.rooms.reduce((sum, room) => sum + room.children, 0);
    return `${totalAdults} adults, ${totalChildren} children`;
  }
  
}

