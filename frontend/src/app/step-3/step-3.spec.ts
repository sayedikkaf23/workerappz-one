import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3 } from './step-3';

describe('Step3', () => {
  let component: Step3;
  let fixture: ComponentFixture<Step3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
