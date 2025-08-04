import { Component, EventEmitter, Output } from '@angular/core';
import { Contact } from '../services/contact';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category-modal',
  standalone: false,
  templateUrl: './add-category-modal.html',
  styleUrl: './add-category-modal.css'
})
export class AddCategoryModal {

  categoryName = '';
  defaultAmount: number | null = null;


  constructor(private contactService: Contact, 
  
    private toastr: ToastrService,
   ) {


}


  @Output() categoryAdded = new EventEmitter<{ name: string, amount: number }>();
  @Output() modalClosed = new EventEmitter<void>();

  onSubmit() {
    if (this.categoryName && this.defaultAmount != null) {
      // this.categoryAdded.emit({ name: this.categoryName, amount: this.defaultAmount });


      
    const createCardData = {
     
  
      name:  this.categoryName,
      default_amount: this.defaultAmount
    };

    this.contactService.createNewFundCategory(createCardData).subscribe(
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
