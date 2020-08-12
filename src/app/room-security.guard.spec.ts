import { TestBed } from '@angular/core/testing';

import { RoomSecurityGuard } from './room-security.guard';

describe('RoomSecurityGuard', () => {
  let guard: RoomSecurityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoomSecurityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
