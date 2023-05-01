import { TestBed } from '@angular/core/testing';

import { CarpenterService } from './carpenter.service';

describe('CarpenterService', () => {
  let service: CarpenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarpenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
