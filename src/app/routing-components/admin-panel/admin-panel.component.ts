import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, registerables } from 'chart.js';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
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
  isEditModalOpen = false;
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
  }

  ngOnInit(): void {
    const userJson = sessionStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
  
    if (!user || !user.isAdmin) {
      this.router.navigate(['/notfound']);
    } else {
      this.loadBookings();
      this.loadSupportTickets();
      this.loadCustomers();
    }
  }
  

  ngAfterViewInit(): void {
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
  
  
  
}
