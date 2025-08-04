import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardActions } from './card-actions';

describe('CardActions', () => {
  let component: CardActions;
  let fixture: ComponentFixture<CardActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
