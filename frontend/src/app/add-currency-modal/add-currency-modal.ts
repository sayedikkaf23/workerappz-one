import { Component, EventEmitter, Output } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-currency-modal',
  standalone: false,
  templateUrl: './add-currency-modal.html',
  styleUrl: './add-currency-modal.css'
})
export class AddCurrencyModal {

   currencyName = '';
  currencyCode = '';
  isActive: boolean = false;
  isSettlement: boolean = false;
  scale:number | null = null


  constructor(private admin: AdminService, 
  
    private toastr: ToastrService,
   ) {


}


  @Output() currencyAdded = new EventEmitter<{ currencyName: string, currencyCode: string,isActive: boolean, isSettlement: boolean, scale:number  }>();
  @Output() modalClosed = new EventEmitter<void>();

  onSubmit() {
     if (!this.currencyName || !this.currencyName.trim()) {
    this.toastr.warning('Please enter the currency name', 'Validation');
    return;
  }

  if (!this.currencyCode || !this.currencyCode.trim()) {
    this.toastr.warning('Please enter the currency code', 'Validation');
    return;
  }

  if (this.scale === null || this.scale === undefined || isNaN(Number(this.scale))) {
    this.toastr.warning('Please enter a valid scale value', 'Validation');
    return;
  }
 

      
    const createCurrencyData = {
     
  
      name:  this.currencyName,
      code: this.currencyCode,
      scale: this.scale,
      isActive: this.isActive,
      auth: this.isSettlement
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
