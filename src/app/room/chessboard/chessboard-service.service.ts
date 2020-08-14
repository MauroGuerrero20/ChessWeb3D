import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChessboardServiceService {

  constructor() { }

  groundOptions = {
      xmin: -3,
      zmin: -3,
      xmax: 3,
      zmax: 3,
      subdivtions: {
        w: 8,
        h: 8,
      },
      precision: {
        w: 2,
        h: 2,
      },
    };

    boardWidth = this.groundOptions.subdivtions.w;
    boardHeight = this.groundOptions.subdivtions.h;
    totalTiles = this.boardWidth * this.boardHeight;
}
