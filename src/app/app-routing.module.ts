import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routing-components/home/home.component';
import { RoomsComponent } from './routing-components/rooms/rooms.component';
import { HotelsComponent } from './routing-components/hotels/hotels.component';
import { BookedRoomsComponent } from './routing-components/booked-rooms/booked-rooms.component';
import { RoomDetailsComponent } from './routing-components/rooms/room-details/room-details.component';
import { NotfoundComponent } from './routing-components/notfound/notfound.component';
import { HotelRoomsComponent } from './routing-components/hotel-rooms/hotel-rooms.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "rooms", component: RoomsComponent},
  {path: "roomdetails/:id", component: RoomDetailsComponent},
  {path: "hotels", component: HotelsComponent},
  {path: "bookedrooms", component: BookedRoomsComponent},
  {path: "hotelrooms", component: HotelRoomsComponent},
  {path: "**", component: NotfoundComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
