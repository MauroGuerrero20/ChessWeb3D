import { Component } from '@angular/core';
import { FormBuilder, Validators, } from '@angular/forms';
import { Router } from "@angular/router"

@Component({
  selector: 'app-user-card-form',
  templateUrl: './user-card-form.component.html',
  styleUrls: ['./user-card-form.component.scss']
})
export class UserCardFormComponent {

  constructor(private fb: FormBuilder, private router: Router) { }

  userForm = this.fb.group({
    nickname: [null, Validators.required],
    roomName: [null, Validators.required],
    roomPassword: [null, Validators.required],
  });

  createJoinRoom() {

    console.log('userForm', this.userForm);

    const nickname = this.userForm.controls.nickname;
    const roomName = this.userForm.controls.roomName;
    const roomPassword = this.userForm.controls.roomPassword;

    const invalidInput = (!nickname.hasError('required') &&
      !roomName.hasError('required') &&
      !roomPassword.hasError('required'));

    if (!invalidInput) {
      // this.router.navigate(['/room/:id']);
    } else {
      // Display Error Message
      this.userForm.markAllAsTouched();
    }
  }
}
