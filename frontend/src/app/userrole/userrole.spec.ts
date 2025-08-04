import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userrole } from './userrole';

describe('Userrole', () => {
  let component: Userrole;
  let fixture: ComponentFixture<Userrole>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Userrole]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Userrole);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
