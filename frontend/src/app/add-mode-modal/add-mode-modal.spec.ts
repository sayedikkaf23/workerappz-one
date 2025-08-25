import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModeModal } from './add-mode-modal';

describe('AddModeModal', () => {
  let component: AddModeModal;
  let fixture: ComponentFixture<AddModeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddModeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModeModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
