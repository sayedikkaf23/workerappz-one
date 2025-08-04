import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusinessUserModal } from './view-business-user-modal';

describe('ViewBusinessUserModal', () => {
  let component: ViewBusinessUserModal;
  let fixture: ComponentFixture<ViewBusinessUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBusinessUserModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBusinessUserModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
