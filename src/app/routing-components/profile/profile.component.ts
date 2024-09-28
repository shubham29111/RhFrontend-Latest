import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environments'; // Ensure this points to your environment config

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  // Profile Data
  profileData: any = {
    fullname: '',
    username: '',
    citizen: '',
    email: '',
    phone: '',
    birthday: '',
  };
  
  // Password Dat

  passwordData: any = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  isModalVisible: boolean = false;  // Modal visibility state
  userData: any;

  originalProfileData: any = {};  // To store the original profile data for comparison
  selectedGender: string = '';

  constructor(private http: HttpClient,private router: Router,private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.getProfile();
  }

  // Fetch profile and store the original profile data
  getProfile(): void {
    this.userData = sessionStorage.getItem('user');
    const user = JSON.parse(this.userData);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`,
    });

    this.http.get<any>(`${environment.baseUrl}/profile`, { headers }).subscribe(
      (data) => {
        this.profileData = data.response; // Assuming `response` holds the profile data
        this.selectedGender = this.profileData.gender || ''; // Set the gender if it exists in the response
        this.originalProfileData = { ...this.profileData, gender: this.selectedGender }; // Store a copy of the original profile data for comparison
      },
      (error) => {
        console.error('Error fetching profile', error);
      }
    );
  }

  // Submit profile changes
  onSubmit(profileForm: any): void {
    if (profileForm.valid) {
      const user = JSON.parse(this.userData);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${user.token}`,
      });

      // Prepare updated fields only
      const updatedProfile = this.prepareUpdatedFields();

      if (Object.keys(updatedProfile).length > 0) {
        // POST request to update the profile only with updated fields
        this.http.post<any>(`${environment.baseUrl}/update-profile`, updatedProfile, { headers }).subscribe(
          (response) => {
            console.log('Profile updated successfully', response);
          },
          (error) => {
            console.error('Error updating profile', error);
          }
        );
      } else {
        console.log('No changes to update');
      }
    }
  }

  // Submit password change request
  onChangePassword(passwordForm: any): void {
    if (passwordForm.valid && this.passwordData.newPassword === this.passwordData.confirmPassword) {
      const user = JSON.parse(this.userData);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${user.token}`,
      });

      const passwordPayload = {
        oldPassword: this.passwordData.currentPassword,
        newPassword: this.passwordData.newPassword
      };

      // POST request to change the password
      this.http.post<any>(`${environment.baseUrl}/reset`, passwordPayload, { headers }).subscribe(
        (response) => {
          console.log('Password changed successfully', response);
          // Optionally reset password form fields here
          this.passwordData = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        },
        (error) => {
          console.error('Error changing password', error);
        }
      );
    }
  }

  // Compare profile data and prepare the payload with only updated fields
  prepareUpdatedFields(): { [key: string]: any } {
    const updatedProfile: { [key: string]: any } = {};

    // Compare fields and add to updatedProfile if different
    if (this.profileData.fullname !== this.originalProfileData.fullname) {
      updatedProfile['fullname'] = this.profileData.fullname;
    }
    if (this.profileData.username !== this.originalProfileData.username) {
      updatedProfile['username'] = this.profileData.username;
    }
    if (this.profileData.citizen !== this.originalProfileData.citizen) {
      updatedProfile['citizen'] = this.profileData.citizen;
    }
    if (this.profileData.phone !== this.originalProfileData.phone) {
      updatedProfile['phone'] = this.profileData.phone;
    }
    if (this.profileData.birthday !== this.originalProfileData.birthday) {
      updatedProfile['birthday'] = this.profileData.birthday;
    }
    if (this.selectedGender !== this.originalProfileData.gender) {
      updatedProfile['gender'] = this.selectedGender;
    }

    return updatedProfile;
  }

  openConfirmationModal(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      console.log('New password and confirm password do not match.');
      return;
    }

    this.isModalVisible = true; // Show the modal
  }

  // Close the modal without confirming
  closeModal(): void {
    this.isModalVisible = false; // Hide the modal
  }

  // Confirm password change and submit the request
  confirmPasswordChange(): void {
    this.isModalVisible = false;  // Hide the modal

    const user = JSON.parse(this.userData);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${user.token}`, // Add your auth token
    });

    const passwordPayload = {
      oldPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    // POST request to change the password
    this.http.post<any>(`${environment.baseUrl}/reset`, passwordPayload, { headers }).subscribe(
      (response) => {
        console.log('Password changed successfully', response);
        // Log out user and redirect to login page
        sessionStorage.clear(); // Clear user session
       this.logout(); 
      },
      (error) => {
        console.error('Error changing password', error);
      }
    );
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
