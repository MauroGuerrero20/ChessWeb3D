import { Component, } from '@angular/core';
import { FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import sha256 from 'crypto-js/sha256';

interface GameRoom {
  players: string[];
  roomName: string;
  roomPassword: string;
  expiresAt: string;
}

@Component({
  selector: 'app-user-card-form',
  templateUrl: './user-card-form.component.html',
  styleUrls: ['./user-card-form.component.scss']
})
export class UserCardFormComponent {

  constructor(private fb: FormBuilder, private router: Router, private firestore: AngularFirestore) { }

  roomForm = this.fb.group({
    nickname: [null, Validators.required],
    roomName: [null, Validators.required],
    roomPassword: [null, Validators.required],
  });

  roomFull = false;

  getRoomId(gameRoom: GameRoom): string {
    return sha256(gameRoom.roomName + gameRoom.roomPassword).toString();
  }

  // Game Room expires after a day
  getExpirationDate() {
    const today = new Date();
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.getTime();
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

  async createJoinRoom(): Promise<any> {

    const nickname = this.roomForm.controls.nickname;
    const roomName = this.roomForm.controls.roomName;
    const roomPassword = this.roomForm.controls.roomPassword;

    const invalidInput = (nickname.hasError('required') ||
      roomName.hasError('required') ||
      roomPassword.hasError('required'));

    if (!invalidInput) {

      const gameRoom: GameRoom = {
        players: [nickname.value],
        roomName: roomName.value,
        roomPassword: roomPassword.value,
        expiresAt: this.getExpirationDate().toString(),
      };

      const retrivedGameRoom: GameRoom = await this.fetchGameRoomFirestore(gameRoom);

      if (retrivedGameRoom !== null && retrivedGameRoom.players.length < 2) {

        gameRoom.players = [...retrivedGameRoom.players, nickname.value];
        await this.updateGameRoomFirestore(gameRoom);

        this.router.navigate(['/room', 1234]);

      } else if (retrivedGameRoom !== null && retrivedGameRoom.players.length >= 2) {
        this.roomFull = true;
      } else {
        await this.storeGameRoomFirestore(gameRoom);
        this.router.navigate(['/room', 1234]);
      }

    } else {
      // Display Form Error Message
      this.roomForm.markAllAsTouched();
    }
  }
}
