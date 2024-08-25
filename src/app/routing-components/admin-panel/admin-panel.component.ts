import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  currentSection: string = 'dashboard'; // Set the default section to 'dashboard'

  showSection(section: string) {
    this.currentSection = section; // Update the currentSection when a menu item is clicked
  }
  bookings = [
    {
      id: 'B001',
      status: 'pending',
      statusColor: 'bg-orange-500',
      hotel: 'Hotel Sunshine',
      hotelIcon: 'path-to-icon/hotel-sunshine.png',
      guest: 'John Doe',
      checkIn: '2024-08-01',
      checkOut: '2024-08-05',
      completion: 60,
      completionColor: 'bg-red-500',
    },
    {
      id: 'B002',
      status: 'completed',
      statusColor: 'bg-green-500',
      hotel: 'Oceanview Resort',
      hotelIcon: 'path-to-icon/oceanview-resort.png',
      guest: 'Jane Smith',
      checkIn: '2024-08-02',
      checkOut: '2024-08-06',
      completion: 100,
      completionColor: 'bg-green-500',
    },
    {
      id: 'B003',
      status: 'delayed',
      statusColor: 'bg-orange-500',
      hotel: 'Mountain View Inn',
      hotelIcon: 'path-to-icon/mountain-view-inn.png',
      guest: 'Alice Johnson',
      checkIn: '2024-08-03',
      checkOut: '2024-08-07',
      completion: 73,
      completionColor: 'bg-red-500',
    },
    {
      id: 'B004',
      status: 'on schedule',
      statusColor: 'bg-green-500',
      hotel: 'City Lights Hotel',
      hotelIcon: 'path-to-icon/city-lights-hotel.png',
      guest: 'Robert Brown',
      checkIn: '2024-08-04',
      checkOut: '2024-08-08',
      completion: 90,
      completionColor: 'bg-green-500',
    },
    {
      id: 'B005',
      status: 'completed',
      statusColor: 'bg-green-500',
      hotel: 'Seaside Retreat',
      hotelIcon: 'path-to-icon/seaside-retreat.png',
      guest: 'Emily Davis',
      checkIn: '2024-08-05',
      checkOut: '2024-08-09',
      completion: 100,
      completionColor: 'bg-green-500',
    },
    {
      id: 'B006',
      status: 'pending',
      statusColor: 'bg-orange-500',
      hotel: 'Grand Palace',
      hotelIcon: 'path-to-icon/grand-palace.png',
      guest: 'Michael Wilson',
      checkIn: '2024-08-06',
      checkOut: '2024-08-10',
      completion: 45,
      completionColor: 'bg-red-500',
    },
    {
      id: 'B007',
      status: 'completed',
      statusColor: 'bg-green-500',
      hotel: 'Royal Hotel',
      hotelIcon: 'path-to-icon/royal-hotel.png',
      guest: 'Sarah Taylor',
      checkIn: '2024-08-07',
      checkOut: '2024-08-11',
      completion: 100,
      completionColor: 'bg-green-500',
    },
    {
      id: 'B008',
      status: 'on schedule',
      statusColor: 'bg-green-500',
      hotel: 'Lakeside Lodge',
      hotelIcon: 'path-to-icon/lakeside-lodge.png',
      guest: 'David Anderson',
      checkIn: '2024-08-08',
      checkOut: '2024-08-12',
      completion: 88,
      completionColor: 'bg-green-500',
    },
    {
      id: 'B009',
      status: 'delayed',
      statusColor: 'bg-orange-500',
      hotel: 'Urban Stay',
      hotelIcon: 'path-to-icon/urban-stay.png',
      guest: 'Jessica Martinez',
      checkIn: '2024-08-09',
      checkOut: '2024-08-13',
      completion: 73,
      completionColor: 'bg-red-500',
    },
    {
      id: 'B010',
      status: 'completed',
      statusColor: 'bg-green-500',
      hotel: 'Country Inn',
      hotelIcon: 'path-to-icon/country-inn.png',
      guest: 'Daniel Harris',
      checkIn: '2024-08-10',
      checkOut: '2024-08-14',
      completion: 100,
      completionColor: 'bg-green-500',
    },
  ];
  rooms = [
    { number: '101', hotel: 'Hotel Sunshine', type: 'Deluxe Suite' },
    { number: '102', hotel: 'Oceanview Resort', type: 'Standard Room' },
    { number: '201', hotel: 'Mountain View Inn', type: 'Single Room' },
    { number: '202', hotel: 'City Lights Hotel', type: 'Double Room' },
    { number: '301', hotel: 'Seaside Retreat', type: 'Executive Suite' },
    { number: '302', hotel: 'Grand Palace', type: 'Presidential Suite' },
    { number: '401', hotel: 'Royal Hotel', type: 'Luxury Room' },
    { number: '402', hotel: 'Lakeside Lodge', type: 'Cottage' },
    { number: '501', hotel: 'Urban Stay', type: 'Penthouse' },
    { number: '502', hotel: 'Country Inn', type: 'Queen Room' },
  ];

  reports = [
    { metric: 'Monthly Revenue', value: '$50,000' },
    { metric: 'Occupancy Rate', value: '75%' },
    { metric: 'Total Bookings', value: '100' },
    { metric: 'Cancelled Bookings', value: '20' },
    { metric: 'Annual Revenue', value: '$600,000' },
    { metric: 'Daily Bookings', value: '15' },
    { metric: 'Available Rooms', value: '85' },
    { metric: 'Active Customers', value: '200' },
    { metric: 'Revenue per Room', value: '$500' },
    { metric: 'Average Stay Length', value: '3 days' },
  ];

  customers = [
    { name: 'John Doe', role: 'Customer', email: 'john@example.com' },
    { name: 'Jane Smith', role: 'Admin', email: 'jane@example.com' },
    { name: 'Alice Johnson', role: 'Customer', email: 'alice@example.com' },
    { name: 'Robert Brown', role: 'Customer', email: 'robert@example.com' },
    { name: 'Emily Davis', role: 'Customer', email: 'emily@example.com' },
    { name: 'Michael Wilson', role: 'Admin', email: 'michael@example.com' },
    { name: 'Sarah Taylor', role: 'Customer', email: 'sarah@example.com' },
    { name: 'David Anderson', role: 'Customer', email: 'david@example.com' },
    { name: 'Jessica Martinez', role: 'Customer', email: 'jessica@example.com' },
    { name: 'Daniel Harris', role: 'Admin', email: 'daniel@example.com' },
  ];

  payments = [
    { id: 'T001', amount: '$200', status: 'Completed' },
    { id: 'T002', amount: '$150', status: 'Pending' },
    { id: 'T003', amount: '$300', status: 'Failed' },
    { id: 'T004', amount: '$450', status: 'Completed' },
    { id: 'T005', amount: '$100', status: 'Refunded' },
    { id: 'T006', amount: '$250', status: 'Pending' },
    { id: 'T007', amount: '$350', status: 'Completed' },
    { id: 'T008', amount: '$400', status: 'Failed' },
    { id: 'T009', amount: '$500', status: 'Completed' },
    { id: 'T010', amount: '$600', status: 'Pending' },
  ];

  supportTickets = [
    { id: 'T001', issue: 'Booking not confirmed', status: 'Open' },
    { id: 'T002', issue: 'Payment issue', status: 'Closed' },
    { id: 'T003', issue: 'Room not as described', status: 'In Progress' },
    { id: 'T004', issue: 'Website error during booking', status: 'Open' },
    { id: 'T005', issue: 'Late check-in', status: 'Closed' },
    { id: 'T006', issue: 'Booking cancellation request', status: 'Open' },
    { id: 'T007', issue: 'Incorrect charge on credit card', status: 'In Progress' },
    { id: 'T008', issue: 'Room service complaint', status: 'Closed' },
    { id: 'T009', issue: 'Reservation modification', status: 'Open' },
    { id: 'T010', issue: 'Discount code not working', status: 'Closed' },
  ];

  siteSettings = [
    { name: 'Site Title', value: 'Hotel Booking Admin' },
    { name: 'Contact Email', value: 'support@hotelbooking.com' },
    { name: 'Currency', value: 'USD' },
    { name: 'Timezone', value: 'UTC' },
    { name: 'Default Language', value: 'English' },
    { name: 'Booking Cancellation Policy', value: '24 hours before check-in' },
    { name: 'Max Guests Per Room', value: '4' },
    { name: 'Default Room Rate', value: '$150' },
    { name: 'Tax Rate', value: '12%' },
    { name: 'Support Phone Number', value: '+1 800 123 4567' },
  ];

}
