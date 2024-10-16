import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, registerables } from 'chart.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

interface Blog {
  title: string;
  subtitle: string;
  publishedDate: string;
  tags: string[];
  imageUrl: string;
  sectionTitle: string;
  quote: string;
  author: string;
  content: string;
}

Chart.register(...registerables);

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
saveUser() {
throw new Error('Method not implemented.');
}


  currentSection: string = 'dashboard'; // Set the default section to 'dashboard'
  bookings: any[] = [];
  customers: any[] = [];
  payments: any[] = [];
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
  reports = [
    { metric: 'Monthly Revenue', value: '$50,000', target: '$45,000', difference: '+ $5,000', comments: 'Exceeded target' },
    { metric: 'Occupancy Rate', value: '75%', target: '80%', difference: '- 5%', comments: 'Slightly below target' },
    { metric: 'Total Bookings', value: '100', target: '90', difference: '+ 10', comments: 'On track' },
    { metric: 'Cancelled Bookings', value: '20', target: '15', difference: '+ 5', comments: 'Higher than expected' }
  ];
  selectedSection: string = 'dashboard';

  @ViewChild('earningsChart') earningsChartRef!: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router,private loadingService: LoadingService) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale);
    // Initialize the form group in the constructor
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
      tags: ['', [Validators.required]], // Keep this as a string input (comma-separated)
      imageUrl: ['', [Validators.required]],
      sectionTitle: ['', [Validators.required]],
      quote: ['', [Validators.required]],
      author: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
    
  }

  ngOnInit(): void {
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
  
    if (!user || !user.isAdmin) {
      this.router.navigate(['/notfound']);
    } else {
      this.fetchDashboardData();
      this.loadBookings();
      this.loadSupportTickets();
      this.loadCustomers();
      this.getBlogs();
      // this.getTopDestinations();
      this.fetchTopDestinations(); 
    }
    
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
        scrollContainer.scrollLeft = scrollLeft - walk;
      });
    });
  
    this.renderEarningsChart();
    this.renderMonthlyIncreasedChart();
  }


  openEditModal(user: any) {
    this.isEditModalOpen = true;
    this.editUserForm.patchValue(user); // No need for non-null assertion now
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editUserForm.reset(); // Reset form after closing modal
  }

  selectSection(section: string) {
    this.selectedSection = section;
    this.currentSection = section;
  }

  loadBookings() {
    this.http.get<any>(environment.baseUrl + '/book').subscribe(data => {
      console.log(data.response);
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
      console.log(data);
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
        if (response.statusCode === 200) {
          this.dashboardData = response.response;
          console.log('Dashboard Data:', this.dashboardData);
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
    console.log('Logged out');
    setTimeout(() => {
      this.router.navigate(['']).then(() => {
        location.reload();
      });
      this.loadingService.hide();

    }, 2000); 
  }
  
  submitBlogForm() {
    if (this.blogForm.valid) {
      const newBlog = this.blogForm.value as Blog;
  
      // Check if tags is a string, then split it, otherwise, assume it's already an array
      if (typeof newBlog.tags === 'string') {
        newBlog.tags = (newBlog.tags as string).split(',').map((tag: string) => tag.trim());
      }
  
      // POST request to create the blog
      this.http.post<any>(`${environment.baseUrl}/posts`, newBlog).subscribe(
        (response) => {
          // this.blogs.push(response);
          this. getBlogs();  // Add the newly created blog to the list
          this.showSuccessModal = true;  // Show success modal
          this.blogForm.reset();  // Reset the form after submission
        },
        (error) => {
          console.error('Error creating blog:', error);
        }
      );
    }
  }
  

 getBlogs() {
    this.http.get<any>(environment.baseUrl + '/posts')
      .subscribe(response => {
        console.log('Blogs fetched successfully:', response);
        this.blogs = response.response; // Assign the fetched blogs to the blogs array
      }, error => {
        console.error('Error fetching blogs:', error);
      });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
  
  

  editBlog(blog: Blog) {
    // Populate the form with the blog data for editing
    this.blogForm.patchValue(blog);
  }

  deleteBlog(blog: Blog) {
    // Remove the blog from the list
    this.blogs = this.blogs.filter(b => b !== blog);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      const apiUrl = `${environment.baseUrl}/users`; 
  
      const requestBody = { 
        userId: userId 
      };
  
      this.http.request('delete', apiUrl, { body: requestBody }).subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          this.customers = this.customers.filter(user => user.id !== userId);
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

    // Make the API call to search regions using GET with query params
    this.http.get<any>(`${environment.baseUrl}/regionsV1?search=${term}&page=1&limit=10`).subscribe(
      (response) => {
        this.isLoading = false;
        // Extract regions data from the response
        this.regions = response.response.data.map((region: any) => ({
          id: region.id,
          name: region.name,
          countryCode: region.countryCode,
          type: region.type,
          imageUrl: '', // Default imageUrl field
          active: true // Default active status
        }));
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching regions:', error);
      }
    );
  }

  // Function to submit the selected region and add it to the table
  submitTopDestinations() {
    if (!this.selectedRegion) {
      return; // If no region is selected, do nothing
    }

    const selectedRegionObject = this.regions.find(region => region.id === this.selectedRegion);

    // Check if the region already exists in the selectedRegions array
    if (selectedRegionObject && !this.selectedRegions.some(region => region.id === selectedRegionObject.id)) {
      // Add the selected region to the list of top destinations (avoid duplicates)
      this.selectedRegions.push({
        ...selectedRegionObject,
        imageUrl: '', // Make image URL required for each region
        active: true // Default active status
      });
      this.selectedRegion = null; // Reset the dropdown
    }
  }

  // Remove a selected region from the list
  removeRegion(regionId: string) {
    this.selectedRegions = this.selectedRegions.filter(region => region.id !== regionId);
  }

  // Update image URL for a specific region
  updateImageUrl(regionId: string, event: Event) {
    const imageUrl = (event.target as HTMLInputElement).value;
    const region = this.selectedRegions.find(region => region.id === regionId);
    if (region) {
      region.imageUrl = imageUrl;
    }
  }

  // Toggle the active status for a specific region
  toggleActiveStatus(regionId: string) {
    const region = this.selectedRegions.find(region => region.id === regionId);
    if (region) {
      // Toggle the active state
      region.active = !region.active;
  
      // Prepare the update payload
      const payload = {
        title: region.title,
        location: region.location,
        regionId: Number(region.regionId),
        active: region.active,
        imageUrl: region.imageUrl
      };
  
      // Update the active status via API
      this.http.post(`${environment.baseUrl}/top-destinations/${region.id}`, payload)
        .subscribe(
          response => {
            console.log('Successfully updated region:', response);
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
  
  // Submit the selected regions to update the top destinations
  submitRegions() {
    const invalidRegion = this.selectedRegions.find(region => !region.imageUrl);
    if (invalidRegion) {
      this.isInvalid = true; // Mark as invalid if any region has no image URL
      return;   
    }
console.log(this.selectedRegions);

    // Prepare data for submission
    const updateData = this.selectedRegions.map(region => ({
      title: region.name,
      location: region.name, // Assuming location is the same as the region name
      regionId: Number(region.id),
      active: region.active,
      imageUrl: region.imageUrl
    }));

    // Submit the data via POST request (this would be your update API call)
    updateData.forEach(destination => {
      const apiUrl = `${environment.baseUrl}/top-destinations`;
      this.http.post(apiUrl, destination).subscribe(
        (response) => {
          console.log('Top destination updated successfully:', response);
        },
        (error) => {
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
          title: region.title, // Ensure title is mapped
          location: region.location, // Ensure location is mapped
          regionId: region.regionId, // Correct regionId reference
          name: region.Region.name,
          countryCode: region.Region.countryCode,
          type: region.Region.type,
          imageUrl: region.imageUrl || '', // Ensure imageUrl is set
          active: region.active
        }));
      },
      (error) => {
        console.error('Error fetching top destinations', error);
      }
    );
  }

  openChatwootForTicket(ticket: any) {
    // Logic to open Chatwoot, or you can customize the logic
    // Example: Send specific ticket info to Chatwoot if needed
    window.open('https://app.chatwoot.com/app/login', '_blank');
  }
  
  
}
