import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-permission-modal',
  standalone: false,
  templateUrl: './add-permission-modal.html',
  styleUrl: './add-permission-modal.css'
})
export class AddPermissionModal {
    
   sendCountryName = '';
  receiveCountryName = '';
  permission = '';
 


  constructor(private admin: AdminService, 
  
    private toastr: ToastrService,
   ) {


}


  @Output() currencyAdded = new EventEmitter<{ sendCountryName: string, receiveCountryName: string , permission: string}>();
  @Output() modalClosed = new EventEmitter<void>();

  onSubmit() {
     if (!this.sendCountryName || !this.sendCountryName.trim()) {
    this.toastr.warning('Please select the send country name', 'Validation');
    return;
  }

  if (!this.receiveCountryName || !this.receiveCountryName.trim()) {
    this.toastr.warning('Please select the receive country name', 'Validation');
    return;
  }

   if (!this.permission || !this.permission.trim()) {
    this.toastr.warning('Please select the receive country name', 'Validation');
    return;
  }


 
 

      
    const createCurrencyData = {
     
  
      sendCountry:  this.sendCountryName,
      receiveCountry: this.receiveCountryName,
     permission: this.permission
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
