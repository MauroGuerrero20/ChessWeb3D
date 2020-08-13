import { Component, HostListener, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import {
  Scene,
  Engine,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  Mesh,
  Tools,
} from 'babylonjs';

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

  constructor() { }
  ngOnInit(): void { }

  createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {

    const scene = new Scene(engine);

    const camera = new ArcRotateCamera('camera1', Tools.ToRadians(180), Tools.ToRadians(70), 10, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene, false, Mesh.FRONTSIDE);
    sphere.position.y = 1;

    const ground = Mesh.CreateGround('ground1', 6, 6, 2, scene, false);

    // scene.debugLayer.show();

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
