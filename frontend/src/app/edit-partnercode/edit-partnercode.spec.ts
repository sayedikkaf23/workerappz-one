import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPartnercode } from './edit-partnercode';

describe('EditPartnercode', () => {
  let component: EditPartnercode;
  let fixture: ComponentFixture<EditPartnercode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPartnercode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPartnercode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
