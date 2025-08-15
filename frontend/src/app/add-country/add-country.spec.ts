import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountry } from './add-country';

describe('AddCountry', () => {
  let component: AddCountry;
  let fixture: ComponentFixture<AddCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCountry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCountry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
