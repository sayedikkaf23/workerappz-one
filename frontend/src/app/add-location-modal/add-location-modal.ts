import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-location-modal',
  standalone: false,
  templateUrl: './add-location-modal.html',
  styleUrl: './add-location-modal.css'
})
export class AddLocationModal {
   
   countryName = '';
  cityName = '';
 locationName = '';


  constructor(private admin: AdminService, 
  
    private toastr: ToastrService,
   ) {


}


  @Output() locationAdded = new EventEmitter<{ countryName: string, cityName: string, locationName: string }>();
  @Output() modalClosed = new EventEmitter<void>();

  onSubmit() {
     if (!this.countryName || !this.countryName.trim()) {
    this.toastr.warning('Please select the country name', 'Validation');
    return;
  }

  if (!this.cityName || !this.cityName.trim()) {
    this.toastr.warning('Please select the city', 'Validation');
    return;
  }

 
 

      
    const createCurrencyData = {
     
  
      name:  this.countryName,
      code: this.cityName,
     
    };

    this.admin.createCurrency(createCurrencyData).subscribe(
      (response) => {
        this.closeModal();
        this.toastr.success(' New Fund Category Added successfully!', 'Success');
        this.closeModal();
        window.location.reload();
      },
      (error) => {
        console.error('Error activating card:', error);
        this.closeModal();
      }
    );
     
    
  }

  onClose() {
    this.closeModal();
  }

  private closeModal() {
    this.modalClosed.emit();
  }

}
