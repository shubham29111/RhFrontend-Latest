import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() message: string | null = null; // Input binding to receive the message
  @Input() type: 'success' | 'error' = 'success'; // Input binding to determine message type

  // You can also implement other logic here if needed, such as automatic hiding or a close button
  closeAlert() {
    this.message = null; // Clear the message and hide the alert
  }}
