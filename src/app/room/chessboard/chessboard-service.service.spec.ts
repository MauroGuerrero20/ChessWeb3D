import { TestBed } from '@angular/core/testing';

import { ChessboardServiceService } from './chessboard-service.service';

describe('ChessboardServiceService', () => {
  let service: ChessboardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessboardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
