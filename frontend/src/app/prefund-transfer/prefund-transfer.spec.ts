import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefundTransfer } from './prefund-transfer';

describe('PrefundTransfer', () => {
  let component: PrefundTransfer;
  let fixture: ComponentFixture<PrefundTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrefundTransfer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrefundTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
