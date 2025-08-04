import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessUser } from './business-user';

describe('BusinessUser', () => {
  let component: BusinessUser;
  let fixture: ComponentFixture<BusinessUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
