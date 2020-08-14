import { Component, HostListener, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import {
  Scene,
  Engine,
  ArcRotateCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  SubMesh,
  StandardMaterial,
  MultiMaterial,
  Texture,
  CubeTexture,
  Tools,
  Vector3,
  Color3,
} from 'babylonjs';
import { xor } from 'mathjs';
import { ChessboardServiceService } from './chessboard-service.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent implements OnInit, AfterViewInit {

  @ViewChild('renderCanvas', { static: true })
  private canvasRef: ElementRef<HTMLCanvasElement>;

  private canvas: HTMLCanvasElement;
  private engine: Engine;

  constructor(private chessboardService: ChessboardServiceService) { }
  ngOnInit(): void { }

  createChesboardGround(scene: Scene): Mesh {

    // Chessboard Options
    const options = this.chessboardService.boardOptions;

    const boardWidth = this.chessboardService.boardWidth;
    const boardHeight = this.chessboardService.boardHeight;
    const totalTiles = this.chessboardService.totalTiles;

    var chessboardMaterial = new StandardMaterial("chessboardMaterial", scene);
	  chessboardMaterial.diffuseTexture = new Texture('https://upload.wikimedia.org/wikipedia/commons/d/d5/Chess_Board.svg', scene);

    const chessboardBox = MeshBuilder.CreateTiledBox('chessboardBox', options, scene);
    chessboardBox.material = chessboardMaterial;

    return chessboardBox
  }

  createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {

    const scene: Scene = new Scene(engine);

    const camera: ArcRotateCamera = new ArcRotateCamera('camera1', Tools.ToRadians(180), Tools.ToRadians(70), 20, Vector3.Zero(), scene);
    camera.attachControl(canvas, false);

    const light: HemisphericLight = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const sphere: Mesh = Mesh.CreateSphere('sphere1', 16, 2, scene, false, Mesh.FRONTSIDE);
    sphere.position.y = 1;

    const ground = this.createChesboardGround(scene);

    return scene;
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;

    this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });

    const scene: Scene = this.createScene(this.engine, this.canvas);

    this.engine.runRenderLoop(() => {
      scene.render();
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.engine.resize();
  }

}
