import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import sha256 from 'crypto-js/sha256';

interface GameRoom {
  players: string[];
  roomName: string;
  roomPassword: string;
  expiresAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameRoomServiceService {
  constructor(private firestore: AngularFirestore) { }

  getRoomId(gameRoom: GameRoom): string {
    return sha256(gameRoom.roomName + gameRoom.roomPassword).toString();
  }

  getRoomUrlId(gameRoom: GameRoom): string {
    return sha256(sha256(gameRoom.roomName + gameRoom.roomPassword).toString()).toString();
  }

  // Game Room expires after a day
  getExpirationDate(): number {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.getTime();
  }

  rejoiningRoom(gameRoom: GameRoom, player: string): boolean {

    for (const roomPlayer of gameRoom.players) {
      if (roomPlayer === player) {
        return true;
      }
    }
    return false;
  }

  storeGameRoomBrowser(gameRoom: GameRoom): void {
    const userRoomsStr: string = window.localStorage.getItem('userRooms') || '';

    if (userRoomsStr) {
      const userRooms = userRoomsStr.split('|');

      for (const roomStr of userRooms) {
        if (!roomStr) {
          continue;
        }

        const room: GameRoom = JSON.parse(roomStr);

        if (room.roomName === gameRoom.roomName &&
          room.roomPassword === gameRoom.roomPassword) {
          return;
        }
      }
      window.localStorage.setItem('userRooms', userRoomsStr.concat(`${JSON.stringify(gameRoom)}|`));
    }
    else {
      window.localStorage.setItem('userRooms', userRoomsStr.concat(`${JSON.stringify(gameRoom)}|`));
    }
  }

  async fetchGameRoomFirestore(gameRoom: GameRoom): Promise<any> {

    const docRef = this.firestore.collection('rooms').doc(this.getRoomId(gameRoom));

    const retrivedGameRoom = await docRef.get().toPromise()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          return null;
        }
      })
      .catch(err => {
        console.log(err);
        return null;
      });

    return retrivedGameRoom;
  }

  async storeGameRoomFirestore(gameRoom: GameRoom): Promise<any> {

    const docRef = this.firestore.collection('rooms').doc(this.getRoomId(gameRoom));

    return docRef.set(gameRoom)
      .catch((err) => {
        console.error(err);
      });
  }

  async updateGameRoomFirestore(gameRoom: GameRoom): Promise<any> {

    const docRef = this.firestore.collection('rooms').doc(this.getRoomId(gameRoom));

    return docRef.update({
      players: gameRoom.players,
    })
      .catch(err => console.log(err));
  }
}
