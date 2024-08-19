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
}
