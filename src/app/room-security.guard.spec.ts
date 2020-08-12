import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RoomSecurityGuard } from './room-security.guard';

describe('RoomSecurityGuard', () => {
  let guard: RoomSecurityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ]
    });
    guard = TestBed.inject(RoomSecurityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
