import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-mode-modal',
  standalone: false,
  templateUrl: './add-mode-modal.html',
  styleUrl: './add-mode-modal.css'
})
export class AddModeModal {

  
   countryName = '';
  modeName = '';
 


  constructor(private admin: AdminService, 
  
    private toastr: ToastrService,
   ) {


}


  @Output() currencyAdded = new EventEmitter<{ countryName: string, modeName: string }>();
  @Output() modalClosed = new EventEmitter<void>();

  onSubmit() {
     if (!this.countryName || !this.countryName.trim()) {
    this.toastr.warning('Please select the country name', 'Validation');
    return;
  }

  if (!this.modeName || !this.modeName.trim()) {
    this.toastr.warning('Please select the mode of payment', 'Validation');
    return;
  }

 
 

      
    const createCurrencyData = {
     
  
      name:  this.countryName,
      code: this.modeName,
     
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
