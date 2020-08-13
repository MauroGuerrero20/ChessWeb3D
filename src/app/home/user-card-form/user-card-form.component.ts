import { Component, } from '@angular/core';
import { FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { GameRoomServiceService } from '../../game-room-service.service';
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gameRoomService: GameRoomServiceService) { }

  roomForm = this.fb.group({
    nickname: [null, Validators.required],
    roomName: [null, Validators.required],
    roomPassword: [null, Validators.required],
  });

  roomFull = false;

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
        expiresAt: this.gameRoomService.getExpirationDate().toString(),
      };

      const retrivedGameRoom: GameRoom = await this.gameRoomService.fetchGameRoomFirestore(gameRoom);

      const joiningRoom: boolean = (retrivedGameRoom !== null &&
        retrivedGameRoom.players.length < 2);

      const isFull = (retrivedGameRoom !== null &&
        retrivedGameRoom.players.length >= 2 &&
        !this.gameRoomService.rejoiningRoom(retrivedGameRoom, nickname.value));

      if (joiningRoom) {
        gameRoom.players = [...retrivedGameRoom.players, nickname.value];

        await this.gameRoomService.updateGameRoomFirestore(gameRoom);
        this.gameRoomService.storeGameRoomBrowser(gameRoom);

        const gameRoomUrlId: string = this.gameRoomService.getRoomUrlId(gameRoom);
        this.router.navigate(['/room', gameRoomUrlId]);

      } else if (isFull) {
        this.roomFull = true;
      } else {

        await this.gameRoomService.storeGameRoomFirestore(gameRoom);
        this.gameRoomService.storeGameRoomBrowser(gameRoom);

        const gameRoomUrlId = this.gameRoomService.getRoomUrlId(gameRoom);
        this.router.navigate(['/room', gameRoomUrlId]);
      }

    } else {
      // Display Form Error Message
      this.roomForm.markAllAsTouched();
    }
  }
}
