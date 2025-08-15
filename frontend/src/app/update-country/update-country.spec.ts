import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCountry } from './update-country';

describe('UpdateCountry', () => {
  let component: UpdateCountry;
  let fixture: ComponentFixture<UpdateCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCountry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCountry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
