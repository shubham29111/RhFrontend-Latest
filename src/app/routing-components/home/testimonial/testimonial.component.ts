import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',  // Added missing template URL
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent implements OnInit {
  testimonials: any[] = [];  // Holds all reviews
  displayedTestimonials: any[] = [];  // Holds the reviews currently displayed
  currentPage: number = 0;  // Tracks the current page of reviews being displayed
  reviewsPerPage: number = 5;  // Defines how many reviews to show per page

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getReviews();
  }

  // Fetch reviews from the API
  getReviews(): void {
    this.http.get<any>(`${environment.baseUrl}/dashboardreviews`).subscribe(
      (response) => {
        this.testimonials = response.response;  // Assuming response contains a 'response' array of reviews
        this.displayedTestimonials = this.testimonials.slice(0, this.reviewsPerPage);  // Show initial reviews
      },
      (error) => {
        console.error('Error fetching reviews', error);
      }
    );
  }

  // Load more reviews when needed
  loadMoreReviews(): void {
    const nextPage = this.testimonials.slice(
      this.currentPage * this.reviewsPerPage,
      (this.currentPage + 1) * this.reviewsPerPage
    );
    this.displayedTestimonials = [...this.displayedTestimonials, ...nextPage];  // Add the next batch of reviews
    this.currentPage++;  // Increment page count
  }

  // Check if there are more reviews to load
  hasMoreReviews(): boolean {
    return this.currentPage * this.reviewsPerPage < this.testimonials.length;
  }

  // Check if all reviews are already displayed
  areAllReviewsLoaded(): boolean {
    return this.displayedTestimonials.length === this.testimonials.length;
  }

  // Show fewer reviews (reset to the initial state)
  showLessReviews(): void {
    this.displayedTestimonials = this.testimonials.slice(0, this.reviewsPerPage);
    this.currentPage = 1;  // Reset to page 1
  }
}
