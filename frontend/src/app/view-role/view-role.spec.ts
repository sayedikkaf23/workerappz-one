import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRole } from './view-role';

describe('ViewRole', () => {
  let component: ViewRole;
  let fixture: ComponentFixture<ViewRole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewRole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
