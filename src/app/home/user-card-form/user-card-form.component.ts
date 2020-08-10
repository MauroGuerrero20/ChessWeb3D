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
  });


  getNicknameErrorMessage() {
    const nickname = this.userForm.controls.nickname;

    if (nickname.hasError('required')) {
      return 'You must enter a nickname';
    }
  }

  // TODO: Redirect on click instead of using routerLink

  createRoom() {
    console.log('userForm Create', this.userForm);
    this.router.navigate(['/create-room'])
  }

  joinRoom() {
    console.log('userForm Join', this.userForm);
    this.router.navigate(['/room/:id'])
  }
}
