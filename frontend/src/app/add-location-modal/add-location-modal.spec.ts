import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocationModal } from './add-location-modal';

describe('AddLocationModal', () => {
  let component: AddLocationModal;
  let fixture: ComponentFixture<AddLocationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddLocationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLocationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
