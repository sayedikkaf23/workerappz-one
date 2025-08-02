import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIpaddress } from './add-ipaddress';

describe('AddIpaddress', () => {
  let component: AddIpaddress;
  let fixture: ComponentFixture<AddIpaddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIpaddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIpaddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
