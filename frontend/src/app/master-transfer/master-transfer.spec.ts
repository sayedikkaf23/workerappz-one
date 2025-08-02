import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTransfer } from './master-transfer';

describe('MasterTransfer', () => {
  let component: MasterTransfer;
  let fixture: ComponentFixture<MasterTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterTransfer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterTransfer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
