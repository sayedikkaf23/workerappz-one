import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-business-user-modal',
  standalone: false,
  templateUrl: './view-business-user-modal.html',
  styleUrl: './view-business-user-modal.css'
})
export class ViewBusinessUserModal {
   constructor(
    public dialogRef: MatDialogRef<ViewBusinessUserModal>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
