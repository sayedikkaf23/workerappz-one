import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admincard } from './admincard';

describe('Admincard', () => {
  let component: Admincard;
  let fixture: ComponentFixture<Admincard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Admincard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admincard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
