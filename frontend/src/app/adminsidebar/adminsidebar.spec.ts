import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminsidebar } from './adminsidebar';

describe('Adminsidebar', () => {
  let component: Adminsidebar;
  let fixture: ComponentFixture<Adminsidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adminsidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminsidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
