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

    // Tited Ground Options
    const options = this.chessboardService.groundOptions;

    const boardWidth = this.chessboardService.boardWidth;
    const boardHeight = this.chessboardService.boardHeight;
    const totalTiles = this.chessboardService.totalTiles;

    const chessboardGround: Mesh = Mesh.CreateTiledGround(
      'chessboardGround',
      options.xmin,
      options.zmin,
      options.xmax,
      options.zmax,
      options.subdivtions,
      options.precision,
      scene
    );

    const whiteMaterial = new StandardMaterial('whiteMaterialBoard', scene);
    whiteMaterial.diffuseColor = Color3.White();

    const blackMaterial = new StandardMaterial('blackMaterialBoard', scene);
    blackMaterial.diffuseColor = Color3.Black();

    const multiMaterial = new MultiMaterial('multiMaterialBoard', scene);
    multiMaterial.subMaterials.push(whiteMaterial);
    multiMaterial.subMaterials.push(blackMaterial);

    chessboardGround.material = multiMaterial;

    const verticesCount = chessboardGround.getTotalVertices();
    const tileIndicesLength = chessboardGround.getIndices().length / totalTiles;

    chessboardGround.subMeshes = [];
    let base = 0;
    for (let row = 0; row < boardHeight; row++) {
      for (let col = 0; col < boardWidth; col++) {
        chessboardGround.subMeshes.push(new SubMesh(Number(xor(row % 2, col % 2 )), 0, verticesCount, base, tileIndicesLength, chessboardGround));
        base += tileIndicesLength;
      }
    }

    return chessboardGround;
  }

  createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {

    const scene: Scene = new Scene(engine);

    const camera: ArcRotateCamera = new ArcRotateCamera('camera1', Tools.ToRadians(180), Tools.ToRadians(70), 10, Vector3.Zero(), scene);
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
