import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalBank } from './personal-bank';

describe('PersonalBank', () => {
  let component: PersonalBank;
  let fixture: ComponentFixture<PersonalBank>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalBank]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalBank);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
