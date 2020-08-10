import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateRoomComponent } from './create-room/create-room.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'create-room', component: CreateRoomComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
