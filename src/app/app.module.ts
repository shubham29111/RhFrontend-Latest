import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSelectModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared-components/header/header.component';
import { FooterComponent } from './shared-components/footer/footer.component';
import { HomeComponent } from './routing-components/home/home.component';
import { HotelsComponent } from './routing-components/hotels/hotels.component';
import { BannerComponent } from './routing-components/home/banner/banner.component';
import { HomecardsComponent } from './routing-components/home/homecards/homecards.component';
import { UspsectionComponent } from './routing-components/home/uspsection/uspsection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSliderModule } from 'ngx-slider-v2';

import { NotfoundComponent } from './routing-components/notfound/notfound.component';
import { HttpClientModule } from '@angular/common/http';
import { BlogsSectionComponent } from './routing-components/home/blogs-section/blogs-section.component';
import { TestimonialComponent } from './routing-components/home/testimonial/testimonial.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { DatePickerComponent } from './shared-components/date-picker/date-picker.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HotelRoomsComponent } from './routing-components/hotel-rooms/hotel-rooms.component';
import { ImageResizePipe } from './shared-components/pipe/image-resize.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingPopupComponent } from './shared-components/booking-popup/booking-popup.component';
import { AdminPanelComponent } from './routing-components/admin-panel/admin-panel.component';
import { BlogSectionComponent } from './routing-components/blog-section/blog-section.component';
import { AdminLoginComponent } from './routing-components/admin-login/admin-login.component';
import { NotFoundPageComponent } from './routing-components/not-found-page/not-found-page.component';
import { LoadingComponent } from './routing-components/loading/loading.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from './shared-components/pagination/pagination.component';
import { LazyLoadImageDirective } from './shared-components/lazy-load-image.directive';
import { FaqSectionComponent } from './routing-components/faq-section/faq-section.component';
import { ProfileComponent } from './routing-components/profile/profile.component';
import { CardPaymentComponent } from './routing-components/card-payment/card-payment.component';
import { UserFavComponent } from './routing-components/profile/user-fav/user-fav.component';
import { RoomBookingComponent } from './routing-components/room-booking/room-booking.component';
import { BookinghistoryComponent } from './routing-components/bookinghistory/bookinghistory.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationComponent } from './routing-components/notification/notification.component';
import { EditorModule, TINYMCE_SCRIPT_SRC  } from '@tinymce/tinymce-angular';
import { HtmlPagesComponent } from './routing-components/html-pages/html-pages.component';
import { AlertComponent } from './shared-components/alert/alert.component';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HotelsComponent,
    BannerComponent,
    HomecardsComponent,
    UspsectionComponent,
    NotfoundComponent,
    BlogsSectionComponent,
    TestimonialComponent,
    DatePickerComponent,
    HotelRoomsComponent,
    ImageResizePipe,
    BookingPopupComponent,
    AdminPanelComponent,
    BlogSectionComponent,
    AdminLoginComponent,
    NotFoundPageComponent,
    LoadingComponent,
    PaginationComponent,
    LazyLoadImageDirective,
    FaqSectionComponent,
    ProfileComponent,
    CardPaymentComponent,
    UserFavComponent,
    RoomBookingComponent,
    BookinghistoryComponent,
    NotificationComponent,
    HtmlPagesComponent,
    AlertComponent

   
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSliderModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    GoogleMapsModule,
    NgSelectModule,
    NgbModule,
    NgxPaginationModule,
    EditorModule,
    EmojiModule,
    PickerModule
  ],
  providers: [DatePipe,{ provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
