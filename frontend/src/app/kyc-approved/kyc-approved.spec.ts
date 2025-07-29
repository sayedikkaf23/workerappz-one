import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycApproved } from './kyc-approved';

describe('KycApproved', () => {
  let component: KycApproved;
  let fixture: ComponentFixture<KycApproved>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycApproved]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycApproved);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
