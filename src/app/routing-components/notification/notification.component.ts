import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  @Input() message: string = '';
  isVisible: boolean = false;

  showAlert(message: string) {
    this.message = message;
    this.isVisible = true;

    setTimeout(() => {
      this.isVisible = false;
    }, 3000);
  }

  closeAlert() {
    this.isVisible = false;
  }
}
