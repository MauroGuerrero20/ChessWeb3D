import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import sha256 from 'crypto-js/sha256';

interface GameRoom {
  players: string[];
  roomName: string;
  roomPassword: string;
  expiresAt: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ChessWeb3D';

  // TODO: More expiration deletion logic to HomeComponent

  constructor(private firestore: AngularFirestore) { }

  deleteExpiredRoomBrowser(): void {

    const userRoomsStr: string = window.localStorage.getItem('userRooms');

    if (userRoomsStr) {
      const userRooms = userRoomsStr.split('|');
      const activeRooms: GameRoom[] = []; // Non-expired rooms

      let expiredRoom = false;

      for (const roomStr of userRooms) {

        if (!roomStr) {
          continue;
        }
        const room: GameRoom = JSON.parse(roomStr);

        if (Number(room.expiresAt) < Date.now()) {
          window.localStorage.clear();
          expiredRoom = true;
        }
        else {
          activeRooms.push(room);
        }
      }

      if (expiredRoom) {
        const newUserRoomStr = '';

        for (const room of activeRooms) {
          newUserRoomStr.concat(`${JSON.stringify(room)}|`);
        }
        if (newUserRoomStr) {
          window.localStorage.setItem('userRooms', newUserRoomStr);
        }
      }
    }
  }

  async deleteExpiredRoomFirestore(): Promise<any> {

    const roomsCollections = this.firestore.collection('rooms');
    const roomsQuerySnapshot = await roomsCollections.get().toPromise();

    roomsQuerySnapshot.docs.forEach(roomSnapshot => {

      const room = roomSnapshot.data();

      // Expired Room
      if (Number(room.expiresAt) < Date.now()) {

        const roomId: string = sha256(room.roomName + room.roomPassword).toString();

        roomsCollections.doc(roomId).delete()
          .catch(err => console.error(err));
      }
    });
  }

  ngOnInit(): void {
    this.deleteExpiredRoomBrowser();
    this.deleteExpiredRoomFirestore();
  }
}
