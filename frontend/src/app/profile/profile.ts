import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Admin } from '../services/admin';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  data: any = {}; // Holds user profile data

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<Profile>,
    private adminService: Admin
  ) {}

  ngOnInit(): void {
    // this.adminService.getActiveBusinessUsers().subscribe(
    //   (response) => {
    //     if (response && response.users && response.users.length > 0) {
    //       const user = response.users[0]; // Extract the first user from the response
    //       this.data = {
    //         name: `${user.name.first} ${user.name.last}`,
    //         email: user.email,
    //         nationality: user.nationality,
    //         phone: `${user.mobile.country_code}-${user.mobile.number}`,
    //         address: user.address || 'Not provided', // Default value if address is null
    //       };
    //     } else {
    //       console.warn('No active business users found.');
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching active business users:', error);
    //   }
    // );
  }
  
  saveChanges(): void {
    const updatePayload = {
      name: this.data.name || '',
      email: this.data.email || '',
      nationality: this.data.nationality || '',
      phone: this.data.phone || '',
      address: this.data.address || '',
      gender: this.data.gender || 'male', // Default values if not present
      title: this.data.title || 'Mr.',
      id_type: this.data.id_type || 'passport',
      id_number: this.data.id_number || '',
      country_of_issue: this.data.country_of_issue || '',
    };
  
    this.adminService.updateBusiness(updatePayload).subscribe(
      (response) => {
        console.log('Business updated successfully:', response);
        this.dialogRef.close(this.data); // Close dialog and pass updated data back
      },
      (error) => {
        console.error('Error updating business data:', error);
      }
    );
  }
  
  
}
