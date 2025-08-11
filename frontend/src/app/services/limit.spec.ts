import { TestBed } from '@angular/core/testing';

import { Limit } from './limit';

describe('Limit', () => {
  let service: Limit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Limit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
