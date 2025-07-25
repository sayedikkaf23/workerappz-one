import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2 } from './step-2';

describe('Step2', () => {
  let component: Step2;
  let fixture: ComponentFixture<Step2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Step2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
