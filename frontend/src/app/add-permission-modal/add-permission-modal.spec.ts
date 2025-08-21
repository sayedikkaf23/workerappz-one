import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPermissionModal } from './add-permission-modal';

describe('AddPermissionModal', () => {
  let component: AddPermissionModal;
  let fixture: ComponentFixture<AddPermissionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPermissionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPermissionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
