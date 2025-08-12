import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrencyModal } from './add-currency-modal';

describe('AddCurrencyModal', () => {
  let component: AddCurrencyModal;
  let fixture: ComponentFixture<AddCurrencyModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCurrencyModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCurrencyModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
