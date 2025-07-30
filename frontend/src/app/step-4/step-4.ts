import { Component } from '@angular/core';

@Component({
  selector: 'app-step-4',
  standalone: false,
  templateUrl: './step-4.html',
  styleUrl: './step-4.css',
})
export class Step4 {
  isDark = true;
  uploadedTradeLicense: File[] = [];
  uploadedMoaAoa: File[] = [];
  uploadedPassport: File[] = [];
  uploadedNationalId: File[] = [];
  uploadedResidenceProof: File[] = [];


  toggleDarkMode() {
    this.isDark = !this.isDark;
    const wrapper = document.querySelector('.theme-wrapper');
    if (wrapper) {
      if (this.isDark) {
        wrapper.classList.add('dark-active');
      } else {
        wrapper.classList.remove('dark-active');
      }
    }
  }

  onFileSelected(event: Event, targetArray: File[]) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      for (let i = 0; i < input.files.length; i++) {
        targetArray.push(input.files[i]);
      }
      input.value = ''; // clear input
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetArray: File[]) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        targetArray.push(event.dataTransfer.files[i]);
      }
    }
  }

  viewFile(file: File) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }

  removeFile(index: number, targetArray: File[]) {
    targetArray.splice(index, 1);
  }

}
