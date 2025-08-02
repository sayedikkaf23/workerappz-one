import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPartnercode } from './add-partnercode';

describe('AddPartnercode', () => {
  let component: AddPartnercode;
  let fixture: ComponentFixture<AddPartnercode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPartnercode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPartnercode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
