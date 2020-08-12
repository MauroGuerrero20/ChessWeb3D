import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
export class RoomSecurityGuard implements CanActivate {

  constructor(private router: Router) { }

  getUserRooms(): GameRoom[] {
    const userRoomsStr: string = window.localStorage.getItem('userRooms') || '';

    if (userRoomsStr) {
      const userRooms: GameRoom[] = [];

      for (const roomStr of userRoomsStr.split('|')) {

        if (!roomStr) {
          continue;
        }

        const room: GameRoom = JSON.parse(roomStr);
        userRooms.push(room);
      }

      return userRooms;
    }
    else {
      return null;
    }
  }

  getGameRoomUrlId(gameRoom: GameRoom): string {
    return sha256(sha256(gameRoom.roomName + gameRoom.roomPassword).toString()).toString();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userRooms = this.getUserRooms();
    const gameRoomUrlId = route.paramMap.get('id');

    if (userRooms !== null && userRooms.length > 0) {
      for (const userRoom of userRooms) {
        const userRoomUrlId: string = this.getGameRoomUrlId(userRoom);

        if (userRoomUrlId === gameRoomUrlId) {
          return true;
        }
      }
    }
    else {
      this.router.navigate(['/']);
      alert('You are not allowed in this room');
      return false;
    }
  }
}
