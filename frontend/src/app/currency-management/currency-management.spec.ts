import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyManagement } from './currency-management';

describe('CurrencyManagement', () => {
  let component: CurrencyManagement;
  let fixture: ComponentFixture<CurrencyManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
