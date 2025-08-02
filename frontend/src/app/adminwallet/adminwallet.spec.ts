import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminwallet } from './adminwallet';

describe('Adminwallet', () => {
  let component: Adminwallet;
  let fixture: ComponentFixture<Adminwallet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adminwallet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminwallet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
