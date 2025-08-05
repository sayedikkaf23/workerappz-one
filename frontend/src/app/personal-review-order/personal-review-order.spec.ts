import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalReviewOrder } from './personal-review-order';

describe('PersonalReviewOrder', () => {
  let component: PersonalReviewOrder;
  let fixture: ComponentFixture<PersonalReviewOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalReviewOrder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalReviewOrder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
