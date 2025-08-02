import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transferhistory } from './transferhistory';

describe('Transferhistory', () => {
  let component: Transferhistory;
  let fixture: ComponentFixture<Transferhistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Transferhistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transferhistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
