import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RoomSecurityGuard } from './room-security.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'room/:id', component: RoomComponent, canActivate: [RoomSecurityGuard]},
  {path: '**', component: ErrorPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
