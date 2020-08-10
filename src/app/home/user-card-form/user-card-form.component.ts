import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-card-form',
  templateUrl: './user-card-form.component.html',
  styleUrls: ['./user-card-form.component.scss']
})
export class UserCardFormComponent {

  userForm = this.fb.group({
    nickname: [null, Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  getNicknameErrorMessage() {
    const nickname = this.userForm.controls.nickname;

    if (nickname.hasError('required')) {
      return 'You must enter a nickname';
    }
  }

  createRoom() {
    console.log('userForm Create', this.userForm);
  }

  joinRoom() {
    console.log('userForm Join', this.userForm);
  }
}
