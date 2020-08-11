import { Component } from '@angular/core';
import { FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: 'app-user-card-form',
  templateUrl: './user-card-form.component.html',
  styleUrls: ['./user-card-form.component.scss']
})
export class UserCardFormComponent {

  constructor(private fb: FormBuilder,
    private router: Router,
    private firestore: AngularFirestore) { }

  roomForm = this.fb.group({
    nickname: [null, Validators.required],
    roomName: [null, Validators.required],
    roomPassword: [null, Validators.required],
  });

  async storeDataFirestore(roomFormData: any) {

    const gameRoom = {
      players: [roomFormData.nickname.value],
      roomName: roomFormData.roomName.value,
      roomPassword: roomFormData.roomPassword.value,
    }

    console.log('gameRoom', gameRoom, {gameRoom});

    return await this.firestore.collection('rooms').doc("1234").set(gameRoom)
      .then(() => {
        return true; // Room successfully stored
      })
      .catch((err) => {
        console.error(err);
        return false;
      });

  }

  createJoinRoom(): void {

    const nickname = this.roomForm.controls.nickname;
    const roomName = this.roomForm.controls.roomName;
    const roomPassword = this.roomForm.controls.roomPassword;

    console.log('roomForm', this.roomForm, nickname, roomName, roomPassword);

    const invalidInput = (nickname.hasError('required') ||
      roomName.hasError('required') ||
      roomPassword.hasError('required'));

    if (!invalidInput) {
      this.storeDataFirestore({ nickname, roomName, roomPassword });
      this.router.navigate(['/room', 1234]);
    } else {
      // Display Error Message
      this.roomForm.markAllAsTouched();
    }
  }
}
