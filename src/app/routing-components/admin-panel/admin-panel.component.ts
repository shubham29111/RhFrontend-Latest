import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import Compressor from 'compressorjs';
import { ChatwootService } from 'src/app/services/chatwoot.service';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
interface Blog {
  id: string;
  title: string;
  subtitle: string;
  publishedDate: string;
  tags: string[];
  image: string;
  sectionTitle: string;
  quote: string;
  author: string;
  content: string;
}
interface User {
  id: number;
  name: string;
}

interface Message {
  content: string;
  fromUser: boolean;
  timestamp: string;
}


Chart.register(...registerables);

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  currentEditingBlogId: any;
  selectedFile: any;
  imagePreview: any | undefined;
  editingReviewId: any;
saveUser() {
throw new Error('Method not implemented.');
}


  currentSection: string = 'dashboard'; 
  bookings: any[] = [];
  customers: any[] = [];
  payments: any[] = [];
  reviews: any[] = []; 
  supportTickets: any[] = [];
  siteSettings: any[] = [];
  showSuccessModal: boolean = false;
  blogForm: FormGroup ;
  blogs: Blog[] = [];  isEditModalOpen = false;
  currentPageBookings = 1;
  currentPagePayments = 1;
  currentPageUsers = 1;
  currentPageBlogs = 1;
  dashboardData: any = {}; 
  regions: any[] = []; // List of regions fetched from API
  selectedRegion: any = null; // Model for selected region (single)

  selectedRegions: any[] = []; // Selected regions for top destinations
  isLoading: boolean = false; // Flag for showing loading spinner in ng-select
  isInvalid: boolean = false; // Validation flag
  topDestinations: any[] = [];

  isDown = false;
  startX: number = 0;
  scrollLeft: number = 0;

  currentPageSupportTickets = 1;
    editUserForm: FormGroup; // Ensure it's not undefined

  reviewForm: FormGroup ;
  imageBase64: string | null = null;
    reports = [
    { metric: 'Monthly Revenue', value: '$50,000', target: '$45,000', difference: '+ $5,000', comments: 'Exceeded target' },
    { metric: 'Occupancy Rate', value: '75%', target: '80%', difference: '- 5%', comments: 'Slightly below target' },
    { metric: 'Total Bookings', value: '100', target: '90', difference: '+ 10', comments: 'On track' },
    { metric: 'Cancelled Bookings', value: '20', target: '15', difference: '+ 5', comments: 'Higher than expected' }
  ];
  selectedSection: string = 'dashboard';
  htmlPages = [
    'Privacy Policy',
    'Terms & Conditions', 
    'Cookies Policy',
    'Legal Notice'
  ];
  htmlContent = '';
  currentEditingReviewId: number | null = null; 
  selectedHtmlPages:any ='Privacy Policy';
  editorConfig = {
    base_url : '/tinymce',
    suffix : '.min',
    plugins : 'lists image media table link code',
    toolbar: 'undo redo | fontsize forecolor backcolor | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | image media link',
    branding: false,
    height : 500,
  }
  @ViewChild('earningsChart') earningsChartRef!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService,
    private chatwootService : ChatwootService) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);
    this.editUserForm = this.fb.group({
      fullname: [''],
      email: [''],
      isAdmin: [false],
      active: [true],
    });
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      publishedDate: ['', [Validators.required]],
      image: ['', [Validators.required]],
      tags: ['', Validators.required],  
      sectionTitle: ['', [Validators.required]],
      quote: ['', [Validators.required]],
      author: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });

    this.reviewForm = this.fb.group({
      reviewerName: ['', Validators.required],
      reviewerType: ['', Validators.required],
      content: ['', Validators.required],
      ratings: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      image: [''] 
        });
    
  }
  users: User[] = [
    {
      name : 'Rahul',
      id : 1234
    }
  ];
  selectedUser: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  showEmojiPicker: boolean = false;

  ngOnInit(): void {
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    this.loadConversations();
    this.changeHtmlPages(this.selectedHtmlPages);
    if (!user || !user.isAdmin) {
      this.router.navigate(['/notfound']);
    } else {
      this.fetchDashboardData();
      this.loadBookings();
      this.loadSupportTickets();
      this.loadCustomers();
      this.getBlogs();
      this.getReviews();

      this.fetchTopDestinations();
    }
  }
  changeHtmlPages(page:any) {
    this.htmlContent = '';
    this.loadingService.show();
    this.http.get<any>(environment.baseUrl + `/dashboard/page/${page}`).subscribe(data => {
      this.loadingService.hide();
      this.htmlContent = data.response?.htmlContent
    }, error => {
      console.error('Error loading support tickets', error);
    });
  }

  createOrUpdateHtmlPages() {
    const payload = {
      page : this.selectedHtmlPages,
      htmlContent : this.htmlContent
    } 
    this.loadingService.show();
    this.http.post<any>(environment.baseUrl + `/dashboard/page`, payload).subscribe(data => {
      this.loadingService.hide();
    }, error => {
      console.error('Error loading support tickets', error);
    });
  }

  ngAfterViewInit(): void {
    const scrollContainers = document.querySelectorAll('.draggable-scroll-container');

    scrollContainers.forEach((scrollContainer) => {
      let isDown = false;
      let startX: number;
      let scrollLeft: number;
  
      scrollContainer.addEventListener('mousedown', (e: Event) => {
        const mouseEvent = e as MouseEvent; // Cast the event as MouseEvent

        isDown = true;
        scrollContainer.classList.add('active');
        startX = mouseEvent.pageX - scrollContainer.getBoundingClientRect().left;
        scrollLeft = scrollContainer.scrollLeft;
      });
  
      scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('active');
      });
  
      scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('active');
      });
  
      scrollContainer.addEventListener('mousemove', (e: Event) => {
        if (!isDown) return;
        e.preventDefault();
        const mouseEvent = e as MouseEvent; // Cast the event as MouseEvent

        const x = mouseEvent.pageX - scrollContainer.getBoundingClientRect().left;
        const walk = (x - startX) * 2; // Adjust scroll speed multiplier
      });
    });
  
    this.renderEarningsChart();
    this.renderMonthlyIncreasedChart();
  }


  openEditModal(user: any) {
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.currentSection = section;
  }

  loadBookings() {
    this.http.get<any>(environment.baseUrl + '/book').subscribe(data => {
      this.bookings = data.response;
    }, error => {
      console.error('Error loading bookings', error);
    });
  }

  downloadReport() {
    const csvData = this.generateCSV(this.reports);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', 'report.csv');
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  generateCSV(data: any[]): string {
    const headers = 'Metric,Value,Target,Difference,Comments\n';
    const rows = data.map(row => `${row.metric},${row.value},${row.target},${row.difference},${row.comments}`).join('\n');
    return headers + rows;
  }

  loadCustomers() {
    this.http.get<any>(environment.baseUrl + '/users').subscribe(data => {
      this.customers = data.response;
    }, error => {
      console.error('Error loading customers', error);
    });
  }

  loadPayments() {
    this.http.get<any>(environment.baseUrl + '/book').subscribe(data => {
      this.payments = data;
    }, error => {
      console.error('Error loading payments', error);
    });
  }

  loadSupportTickets() {
    this.http.get<any>(environment.baseUrl + '/customer-support').subscribe(data => {
      this.supportTickets = data.response;
    }, error => {
      console.error('Error loading support tickets', error);
    });
  }

  fetchDashboardData(): void {
    const apiUrl = `${environment.baseUrl}/dashboard`; // Replace with your API endpoint

    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          this.dashboardData = response.response;
        }
      },
      (error) => {
        console.error('Error fetching dashboard data', error);
      }
    );
  }

  loadSiteSettings() {
    this.http.get<any>(environment.baseUrl + '/site-settings').subscribe(data => {
      this.siteSettings = data;
    }, error => {
      console.error('Error loading site settings', error);
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'refunded':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  }

  renderEarningsChart() {
    const ctx = document.getElementById('earningsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Earnings',
          data: [12000, 19000, 30000, 5000, 20000, 30000, 45000],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderMonthlyIncreasedChart() {
    const ctx = document.getElementById('monthlyIncreasedChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Increase',
          data: [15000, 25000, 20000, 30000, 40000, 35000, 45000],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  getStatusClass(status: string): string {
    switch (status) {
        case 'Resolved':
            return 'bg-green-100 text-green-800';
        case 'Open':
            return 'bg-red-100 text-red-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
    
}


  getPaymentMethod(paymentMethodId: number): string {
    const paymentMethods: { [key: number]: string } = {
      1: 'Credit Card',
      2: 'PayPal',
      3: 'Bank Transfer',
    };
    return paymentMethods[paymentMethodId] || 'Unknown Method';
  }

  logout() {
    this.loadingService.show();

    sessionStorage.removeItem('user');
    setTimeout(() => {
      this.router.navigate(['']).then(() => {
        location.reload();
      });
      this.loadingService.hide();

    }, 2000); 
  }       

  
  submitBlogForm() {

    if (this.blogForm.valid) {
this.loadingService.show();
      const newBlog = this.blogForm.value as Blog;

      if (typeof newBlog.tags === 'string') {
        newBlog.tags = (newBlog.tags as string).split(',').map((tag: string) => tag.trim());
      }

      if (this.currentEditingBlogId) {
        this.http.post<any>(`${environment.baseUrl}/posts/${this.currentEditingBlogId}`, newBlog).subscribe(
          (response) => {
            this.loadingService.hide();
            this.getBlogs();
            this.blogForm.reset();
this.imagePreview="";
            this.showSuccessModal = true;
          },
          (error) => {
            this.loadingService.hide();

            console.error('Error updating blog:', error);
          }
        );
      } else {
        this.http.post<any>(`${environment.baseUrl}/posts`, newBlog).subscribe(
          (response) => {
            this.loadingService.hide();
            this.getBlogs();
            this.blogForm.reset();
            this.imagePreview="";

            this.showSuccessModal = true;
          },
          (error) => {
            console.error('Error creating blog:', error);
          }
        );
      }
    }
  }

  
  

 getBlogs() {

    this.http.get<any>(environment.baseUrl + '/posts')
      .subscribe(response => {
        this.blogs = response.response; 

        
      }, error => {
        console.error('Error fetching blogs:', error);
      });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
  
  

 editBlog(blog: Blog) {
  // Use formatDateToInput to format the date correctly
  const formattedDate = this.formatDateToInput(blog.publishedDate);

  // Populate the form with the blog data for editing
  this.blogForm.patchValue({
    title: blog.title,
    subtitle: blog.subtitle,
    publishedDate: formattedDate,
    tags: blog.tags.join(', '),  // If tags are array, convert to string for editing
    image: blog.image,  // Set the image URL or base64 here
    sectionTitle: blog.sectionTitle,
    quote: blog.quote,
    author: blog.author,
    content: blog.content
  });

  // Scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Add a flag to indicate we are in edit mode
  this.currentEditingBlogId = blog.id;

  // Optionally, store the image URL to display as a preview
  this.imagePreview = blog.image;
}


  deleteBlog(blogId: string) {
    this.loadingService.show()
    this.http.delete<any>(`${environment.baseUrl}/posts/${blogId}`).subscribe(
      (response) => {
        this.loadingService.hide();
        this.showSuccessModal=true;
        this.blogs = this.blogs.filter(blog => blog.id !== blogId);
      },
      (error) => {
        console.error('Error deleting blog:', error);
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];  // Get the uploaded file
  
    if (file) {
      const reader = new FileReader();
  
      // When the file has been read, set the preview image
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;  // Set the base64 string for preview
      };
      this.blogForm.patchValue({
        image: this.imagePreview
      });
  
      reader.readAsDataURL(file);  // Read the file as a Data URL for image preview
    }
  }
  
  formatDateToInput(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    
    // Pad month and day with leading zeros if necessary
    const month = String(d.getMonth() + 1).padStart(2, '0');  // getMonth() returns 0-11, so +1 to get 1-12
    const day = String(d.getDate()).padStart(2, '0');  // getDate() returns the day of the month
  
    return `${year}-${month}-${day}`;
  }
  
  

  onImageUpload(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
  
        this.blogForm.patchValue({
          image: base64Image
        });
      };
  
    }
  }
  

  deleteUser(userId: number) {
    
    if (confirm('Are you sure you want to delete this user?')) {
      const apiUrl = `${environment.baseUrl}/users`; 
      this.loadingService.show();
      const requestBody = { 
        userId: userId 
      };
  
      this.http.request('delete', apiUrl, { body: requestBody }).subscribe(
        (response) => {
          this.customers = this.customers.filter(user => user.id !== userId);
          this.loadingService.hide();
        this.showSuccessModal=true;
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
  onSearch(event: { term: string }) {
    const term = event.term;

    if (term.length < 3) {
      return;
    }

    this.isLoading = true;

    this.http.get<any>(`${environment.baseUrl}/regionsV1?search=${term}&page=1&limit=10`).subscribe(
      (response) => {
        this.isLoading = false;
        this.regions = response.response.data.map((region: any) => ({
          id: region.id,
          name: region.name,
          countryCode: region.countryCode,
          type: region.type,
        }));
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching regions:', error);
      }
    );
  }

  submitTopDestinations() {
    if (!this.selectedRegion) {
    }

    const selectedRegionObject = this.regions.find(region => region.id === this.selectedRegion);

    if (selectedRegionObject && !this.selectedRegions.some(region => region.id === selectedRegionObject.id)) {
      this.selectedRegions.push({
        ...selectedRegionObject,
      });
    }
  }

  removeRegion(regionId: string) {
    this.selectedRegions = this.selectedRegions.filter(region => region.id !== regionId);
  }

  updateImageUrl(regionId: string, event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string;
        const region = this.selectedRegions.find(region => region.id === regionId);
        
        if (region) {
          region.imageUrl = imageUrl; // Assign the image URL to the region
        }
      };
  
      reader.readAsDataURL(file); // This is needed to trigger reading the file as a Data URL
    }
  }
  
  

  toggleActiveStatus(regionId: string) {

    const region = this.selectedRegions.find(region => region.id === regionId);
    if (region) {
      region.active = !region.active;
  
      const payload = {
        title: region.name,
        location: region.name,
        regionId: Number(region.regionId),
        active: region.active,
        image: region.imageUrl
      };
  
      this.http.post(`${environment.baseUrl}/top-destinations/${region.id}`, payload)
        .subscribe(
          response => {
            this.fetchTopDestinations();
          },
          error => {
            console.error('Error updating region:', error);
          }
        );
    } else {
      console.error('Region not found!');
    }
  }
  
  submitRegions() {
    const invalidRegion = this.selectedRegions.find(region => !region.imageUrl);
    if (invalidRegion) {
      return;
    } 
    const updateData = this.selectedRegions.map(region => ({
      title: region.name,
      regionId: Number(region.id),
      location:region.name,
      active: region.active,
      image: region.imageUrl
    }));
      this.loadingService.show();
    updateData.forEach(destination => {
      const apiUrl = `${environment.baseUrl}/top-destinations`;
      this.http.post(apiUrl, destination).subscribe(
        (response) => {
          this.loadingService.hide();
          this.showSuccessModal=true;
this.fetchTopDestinations();

        },
        (error) => {
          this.loadingService.hide();

          console.error('Error updating top destination:', error);
        }
      );
    });
  }

  fetchTopDestinations() {
    this.http.get<any>(`${environment.baseUrl}/top-destination`).subscribe(
      (response) => {
        this.selectedRegions = response.response.map((region: any) => ({
          id: region.id,
          name: region.Region.name,
          countryCode: region.Region.countryCode,
          imageUrl:region.image,
          type: region.Region.type,
          active: region.active
        }));
      },
      (error) => {
        console.error('Error fetching top destinations', error);
      }
    );
  }

  openChatwootForTicket(ticket: any) {
  }
  onImageUploadRe(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      // Define the max file size (2MB in this case)
      const MAX_SIZE_MB = 2 * 1024 * 1024; // 2MB
  
      // Check if file size exceeds the limit
      if (file.size > MAX_SIZE_MB) {
        alert('File size exceeds 2MB. Please upload a smaller file.');
        return; // Exit the function if the file is too large
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Set canvas dimensions (resize to a max width/height)
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
  
          // Maintain aspect ratio when resizing
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          // Draw the image onto the canvas
          ctx!.drawImage(img, 0, 0, width, height);
  
          // Convert the resized image to Base64
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Quality is set to 0.7 (70%)
  
          // Assign the resized image as Base64
          this.imageBase64 = resizedBase64; // Now this will be used in the preview
        };
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  
  // Update an existing review by ID using POST request
updateReview(id: number, reviewData: any) {
  this.http.post<any>(`${environment.baseUrl}/dashboardreviews/${id}`, reviewData).subscribe(
    (response) => {
      if (response.statusCode === 200) {
        this.getReviews();  // Refresh reviews after update
        this.reviewForm.reset();  // Reset the form
        this.imageBase64 = null;  // Clear image preview
        this.editingReviewId = null;  // Clear editing ID
      } else {
        console.error('Error message:', response.errorMessage);
      }
    },
    (error) => {
      console.error('Error updating review', error);
    }
  );
}


  onUpdateReview(review: any): void {
    this.editingReviewId = review.id;

    this.reviewForm.patchValue({
      reviewerName: review.reviewerName,
      reviewerType: review.reviewerType,
      content: review.content,
      ratings: review.ratings
    });
    this.imageBase64 = review.image;
  }




  
  submitReviewForm() {
    if (this.reviewForm.valid) {
      const reviewData = this.reviewForm.value;
      reviewData.image = this.imageBase64;  // Add base64 image to review
  this.loadingService.show()
      if (this.editingReviewId) {
        // If `editingReviewId` is set, update the existing review
        this.http.post<any>(`${environment.baseUrl}/dashboardreviews/${this.editingReviewId}`, reviewData).subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.getReviews();  // Refresh reviews list
              this.reviewForm.reset();
              this.imageBase64 = null;  // Clear image
              this.editingReviewId = null;  // Clear editing ID
              this.loadingService.hide();
              this.showSuccessModal=true
            } else {
              this.loadingService.hide();
              console.error('Error updating review:', response.errorMessage);
            }
          },
          (error) => {
            console.error('Error updating review', error);
          }
        );
      } else {
        // If `editingReviewId` is not set, create a new review
        this.loadingService.show();

        this.http.post<any>(`${environment.baseUrl}/dashboardreviews`, reviewData).subscribe(
          (response) => {
            if (response.statusCode === 200) {
              this.getReviews();  
              this.reviewForm.reset();
              this.imageBase64 = null;  
              this.loadingService.hide();
              this.showSuccessModal=true
            } else {
              this.loadingService.hide();

              console.error('Error creating review:', response.errorMessage);
            }
          },
          (error) => {
            this.loadingService.hide();

            console.error('Error submitting review', error);
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
  
  

  onDeleteReview(review: any): void {
    if (confirm('Are you sure you want to delete this review?')) {
      
      this.loadingService.show();

      this.http.delete(`${environment.baseUrl}/dashboardreviews/${review.id}`).subscribe(
        () => {
          this.loadingService.hide();
          this.showSuccessModal=true;
          this.getReviews(); 
        },
        (error) => {
          console.error('Error deleting review', error);
        }
      );
    }
  }
  

  getReviews() {
    this.http.get<any>(`${environment.baseUrl}/dashboardreviews`).subscribe(
      (response) => {
        this.reviews = response.response;
      },
      (error) => {
        console.error('Error fetching reviews', error);
      }
    );
  }

  getStars(starRating: number): string {
    let stars = '';
    for (let i = 0; i < starRating; i++) {
      stars += '⭐';
    }
    for (let i = starRating; i < 5; i++) {
      stars += '';
    }
    return stars;
  }


  loadConversations(): void {
    this.chatwootService.getConversations().subscribe((conversations: any) => {
      this.users = conversations.map((conv: any) => ({
        id: conv.id,
        name: conv.meta.sender.name || 'Anonymous'
      }));
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadMessages(user.id);
  }

  loadMessages(conversationId: number): void {
    this.chatwootService.getMessages(conversationId).subscribe((messages: any) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedUser) {
      this.chatwootService.sendMessage(this.selectedUser.id, this.newMessage).subscribe(() => {
        this.messages.push({
          content: this.newMessage,
          fromUser: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.newMessage = '';
        this.showEmojiPicker = false;
      });
    }
  }

  addEmoji(event: EmojiEvent): void {
    this.newMessage += event.emoji.native;
  }
  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }
}
