// step-2.component.ts
import { Component, OnInit } from '@angular/core';
import { Router }               from '@angular/router';
import { OnboardingService }    from '../services/onboarding.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-step-2',
  standalone: false,
  templateUrl: './step-2.html',
  styleUrl: './step-2.css'
})
export class Step2 implements OnInit {
  selectedRequirement: 'personal'|'business'|'prepaid'|'transfer' | null = null;
  cache: any;
  loading:boolean = false;
   isDark = true;
  constructor(
    private svc: OnboardingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.cache = this.svc.getCachedData() || {};
    if (this.cache.requirements) {
      this.selectedRequirement = this.cache.requirements;
    }
  }

  submit() {
    // merge in our choice
    this.cache.requirements = this.selectedRequirement;
    this.svc.setCachedData(this.cache);
    this.loading = true;
    // call the separate requirements API
    if(this.selectedRequirement){
      this.svc.saveRequirements({
      _id:          this.cache._id,
      email:        this.cache.email,
      requirements: this.selectedRequirement
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/step-3']);

      },
      error: err =>{
        console.error('Step2 save failed', err);
        this.loading = false;
      } 
    });
    }
    else{
      this.toastr.error("Please select  any of the service provided", "Select a Service");
      this.loading = false;
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

}
