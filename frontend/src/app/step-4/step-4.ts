import { Component } from '@angular/core';
import { OnboardingService } from '../services/onboarding.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-step-4',
  standalone: false,
  templateUrl: './step-4.html',
  styleUrl: './step-4.css',
})
export class Step4 {
  loading: boolean = false;

  isDark = true;
  email = '';
  uploadedTradeLicense: File[] = [];
  uploadedMoaAoa: File[] = [];
  uploadedPassport: File[] = [];
  uploadedNationalId: File[] = [];
  uploadedResidenceProof: File[] = [];
  // Define your max file size in bytes (20MB = 20 * 1024 * 1024 bytes)
  private readonly MAX_FILE_SIZE_MB = 2;
  private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;

  constructor(private onBoardingService: OnboardingService, private router: Router, private toastr: ToastrService) {}

  ngOnInit() {
    this.email = this.onBoardingService.getCachedData()?.email || '';
    // Fetch existing uploaded files if any
    if(this.email){
       this.onBoardingService.getOnboardingDetailsByEmail(this.email).subscribe(
      (response) => {
        if (response.success) {
          const data = response.data;
          this.uploadedTradeLicense = data.uploadedTradeLicense || [];
          this.uploadedMoaAoa = data.uploadedMoaAoa || [];
          this.uploadedPassport = data.uploadedPassport || [];
          this.uploadedNationalId = data.uploadedNationalId || [];
          this.uploadedResidenceProof = data.uploadedResidenceProof || [];
        }
      },
      (error) => {
        console.error('Error fetching onboarding details:', error);
        this.toastr.error(error.message || 'Failed to fetch onboarding details');
      }
    );
    }
    else{
      this.toastr.error("email ID is not provided for this user", "Email not found")
      this.router.navigate(['/step-1']);;
    }
   
  }
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
        this.uploadFile(input.files[i], targetArray);
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
        this.uploadFile(event.dataTransfer.files[i], targetArray);
      }
    }
  }

  viewFile(file: any) {
    window.open(file.url || URL.createObjectURL(file), '_blank');
  }

  removeFile(index: number, targetArray: File[]) {
    targetArray.splice(index, 1);
  }

   uploadFile(file: File, targetArray: any[]) {
     // 1. Check file size BEFORE attempting to upload
    if (file.size > this.MAX_FILE_SIZE_BYTES) {
      this.toastr.error(`File "${file.name}" is too large. Max size is ${this.MAX_FILE_SIZE_MB} MB.`, 'File Size Exceeded');
      return; // Stop the upload process
    }
    this.loading = true;
    this.onBoardingService.getPresignedUrl(file).subscribe(
      (response: any) => {
        const presignedUrl = response.url;
        // Upload to S3
        fetch(presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file
        }).then(() => {
          // Remove query params from presigned URL to get the public file URL (adjust if needed)
          const uploadedUrl = presignedUrl.split('?')[0];

          // Add file to array
          targetArray.push({
            name: file.name,
            type: "documents",
            url: uploadedUrl
          });
          console.log('File uploaded successfully:', uploadedUrl);
           this.loading = false; 
          this.toastr.success('File uploaded successfully!');
        }).catch((error) => {
          console.error('File upload failed', error);
          this.toastr.error(error.message || 'Failed to upload file');
           this.loading = false; 
        });
      },
      (error) => {
        console.error('Error getting presigned URL', error);
        const errorMsg = error.error?.error || 'Failed to get upload URL';
        this.toastr.error(errorMsg);
         this.loading = false; 
      }
    );
    
  }

  onSubmit() {
     // --- Start Validation ---
    if (this.uploadedTradeLicense.length === 0) {
      this.toastr.error('Please upload Trade License.', 'Validation Error');
      return; // Stop execution
    }

    if (this.uploadedMoaAoa.length === 0) {
      this.toastr.error('Please upload MOA/AOA.', 'Validation Error');
      return; // Stop execution
    }

    if (this.uploadedPassport.length === 0) {
      this.toastr.error('Please upload Passport.', 'Validation Error');
      return; // Stop execution
    }

    if (this.uploadedNationalId.length === 0) {
      this.toastr.error('Please upload National ID.', 'Validation Error');
      return; // Stop execution
    }

    if (this.uploadedResidenceProof.length === 0) {
      this.toastr.error('Please upload Residence Proof.', 'Validation Error');
      return; // Stop execution
    }
    // --- End Validation ---
    const payload = {
      email: this.email,
      uploadedTradeLicense: this.uploadedTradeLicense,
      uploadedMoaAoa: this.uploadedMoaAoa,
      uploadedPassport: this.uploadedPassport,
      uploadedNationalId: this.uploadedNationalId,
      uploadedResidenceProof: this.uploadedResidenceProof
    };

    this.loading =true; 
    this.onBoardingService.addOrUpdateUploadedFiles(payload).subscribe(
      (response) => {
        console.log('Files saved successfully:', response);
        this.loading = false;
        this.toastr.success('Files saved successfully!');
        this.router.navigate(['/step-5']);
      },
      (error) => {
        this.loading = false;
        console.error('Error saving files:', error);
        this.toastr.error(error.message || 'Failed to save files');
      }
    );
  }

}
