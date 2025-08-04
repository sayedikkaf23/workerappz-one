import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transferfund } from './transferfund';

describe('Transferfund', () => {
  let component: Transferfund;
  let fixture: ComponentFixture<Transferfund>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Transferfund]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transferfund);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
