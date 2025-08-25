import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCityModal } from './add-city-modal';

describe('AddCityModal', () => {
  let component: AddCityModal;
  let fixture: ComponentFixture<AddCityModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCityModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCityModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
