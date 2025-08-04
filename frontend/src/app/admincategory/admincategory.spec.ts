import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admincategory } from './admincategory';

describe('Admincategory', () => {
  let component: Admincategory;
  let fixture: ComponentFixture<Admincategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Admincategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admincategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
