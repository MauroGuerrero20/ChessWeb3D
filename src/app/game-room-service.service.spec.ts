import { TestBed } from '@angular/core/testing';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { GameRoomServiceService } from './game-room-service.service';

describe('GameRoomServiceService', () => {
  let service: GameRoomServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ]
    });
    service = TestBed.inject(GameRoomServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
