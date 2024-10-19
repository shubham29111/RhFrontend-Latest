import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './routing-components/home/home.component';
import { RoomsComponent } from './routing-components/rooms/rooms.component';
import { HotelsComponent } from './routing-components/hotels/hotels.component';
import { BookedRoomsComponent } from './routing-components/booked-rooms/booked-rooms.component';
import { RoomDetailsComponent } from './routing-components/rooms/room-details/room-details.component';
import { HotelRoomsComponent } from './routing-components/hotel-rooms/hotel-rooms.component';
import { AdminPanelComponent } from './routing-components/admin-panel/admin-panel.component';
import { BlogSectionComponent } from './routing-components/blog-section/blog-section.component';
import { AdminLoginComponent } from './routing-components/admin-login/admin-login.component';
import { NotFoundPageComponent } from './routing-components/not-found-page/not-found-page.component';
import { RoomBookingComponent } from './routing-components/room-booking/room-booking.component';
import { FaqSectionComponent } from './routing-components/faq-section/faq-section.component';
import { ProfileComponent } from './routing-components/profile/profile.component';
import { UserFavComponent } from './routing-components/profile/user-fav/user-fav.component';
import { BookinghistoryComponent } from './routing-components/bookinghistory/bookinghistory.component';
import { HtmlPagesComponent } from './routing-components/html-pages/html-pages.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "rooms", component: RoomsComponent},
  {path: "roomdetails/:id", component: RoomDetailsComponent},
  {path: "hotels", component: HotelsComponent},
  {path: "bookedrooms", component: BookedRoomsComponent},
  {path: "hotelrooms", component: HotelRoomsComponent},
  {path: "reserve", component: RoomBookingComponent},
  {path: "userProfile", component: ProfileComponent},
  {path: "user/fav", component:UserFavComponent },
  {path: "user/booking", component: BookinghistoryComponent},

  {path: "faq", component: FaqSectionComponent},
  {path: "adminlogin", component: AdminLoginComponent},
  {path: "admin", component: AdminPanelComponent},
  {path: "htmlPages", component: HtmlPagesComponent},

  { path: 'blog/:id', component: BlogSectionComponent },
  {path: "notfound", component: NotFoundPageComponent},



  {path: "**", component: NotFoundPageComponent},
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
