import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfPayment } from './mode-of-payment';

describe('ModeOfPayment', () => {
  let component: ModeOfPayment;
  let fixture: ComponentFixture<ModeOfPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeOfPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeOfPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
