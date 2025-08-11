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
    if (this.currencyName && this.currencyCode != null) {
      // this.categoryAdded.emit({ name: this.categoryName, amount: this.defaultAmount });


      
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
  }

  onClose() {
    this.closeModal();
  }

  private closeModal() {
    this.modalClosed.emit();
  }

}
