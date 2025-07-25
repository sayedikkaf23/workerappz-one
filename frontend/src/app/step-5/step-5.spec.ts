import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5 } from './step-5';

describe('Step5', () => {
  let component: Step5;
  let fixture: ComponentFixture<Step5>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step5]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step5);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
