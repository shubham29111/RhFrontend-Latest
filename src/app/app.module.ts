import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared-components/header/header.component';
import { FooterComponent } from './shared-components/footer/footer.component';
import { HomeComponent } from './routing-components/home/home.component';
import { RoomsComponent } from './routing-components/rooms/rooms.component';
import { HotelsComponent } from './routing-components/hotels/hotels.component';
import { BookedRoomsComponent } from './routing-components/booked-rooms/booked-rooms.component';
import { BannerComponent } from './routing-components/home/banner/banner.component';
import { HomecardsComponent } from './routing-components/home/homecards/homecards.component';
import { UspsectionComponent } from './routing-components/home/uspsection/uspsection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from 'ngx-slider-v2';
import { RoomDetailsComponent } from './routing-components/rooms/room-details/room-details.component';
import { RoomMoredetailsComponent } from './routing-components/rooms/room-details/room-moredetails/room-moredetails.component';
import { OtherRoomsComponent } from './routing-components/rooms/room-details/other-rooms/other-rooms.component';
import { NotfoundComponent } from './routing-components/notfound/notfound.component';
import { HttpClientModule } from '@angular/common/http';
import { BlogsSectionComponent } from './routing-components/home/blogs-section/blogs-section.component';
import { TestimonialComponent } from './routing-components/home/testimonial/testimonial.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    RoomsComponent,
    HotelsComponent,
    BookedRoomsComponent,
    BannerComponent,
    HomecardsComponent,
    UspsectionComponent,
    RoomDetailsComponent,
    RoomMoredetailsComponent,
    OtherRoomsComponent,
    NotfoundComponent,
    BlogsSectionComponent,
    TestimonialComponent,

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSliderModule,
    ReactiveFormsModule,
    
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
