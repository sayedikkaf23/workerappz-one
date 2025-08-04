import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowIpaddress } from './show-ipaddress';

describe('ShowIpaddress', () => {
  let component: ShowIpaddress;
  let fixture: ComponentFixture<ShowIpaddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowIpaddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowIpaddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
