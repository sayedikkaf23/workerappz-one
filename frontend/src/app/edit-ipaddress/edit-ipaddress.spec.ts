import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIpaddress } from './edit-ipaddress';

describe('EditIpaddress', () => {
  let component: EditIpaddress;
  let fixture: ComponentFixture<EditIpaddress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditIpaddress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIpaddress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
