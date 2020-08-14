import { Injectable } from '@angular/core';
import { Mesh } from 'babylonjs';

@Injectable({
  providedIn: 'root'
})
export class ChessboardServiceService {

  constructor() { }

  boardOptions =  {
    width: 16,
    height: 1,
    depth: 16,
    tileWidth: 16,
    tileHeight: 16,
  };

    boardWidth = this.boardOptions.width;
    boardHeight = this.boardOptions.height;
    totalTiles = this.boardWidth * this.boardHeight;
}
