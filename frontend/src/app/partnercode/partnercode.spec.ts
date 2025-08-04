import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Partnercode } from './partnercode';

describe('Partnercode', () => {
  let component: Partnercode;
  let fixture: ComponentFixture<Partnercode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Partnercode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Partnercode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
