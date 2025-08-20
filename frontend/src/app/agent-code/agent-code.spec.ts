import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentCode } from './agent-code';

describe('AgentCode', () => {
  let component: AgentCode;
  let fixture: ComponentFixture<AgentCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgentCode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
