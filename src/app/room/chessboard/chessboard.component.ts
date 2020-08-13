import { Component, HostListener, ViewChild, ElementRef, OnInit, Host } from '@angular/core';
import {
  Scene,
  Engine,
  FreeCamera,
  Vector3,
  HemisphericLight,
  Mesh,
} from "babylonjs";

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss']
})
export class ChessboardComponent implements OnInit {

  @ViewChild('renderCanvas', { static: true })
  private canvasRef: ElementRef<HTMLCanvasElement>;

  private canvas: HTMLCanvasElement;
  private engine: Engine;

  constructor() { }
  ngOnInit(): void { }

  createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {

    const scene = new Scene(engine);
    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene);
    sphere.position.y = 1;

    const ground = Mesh.CreateGround('ground1', 6, 6, 2, scene);

    return scene;

  }

  ngAfterViewInit() {


    this.canvas = this.canvasRef.nativeElement;

    this.engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });

    const scene: Scene = this.createScene(this.engine, this.canvas);

    this.engine.runRenderLoop(() => {
      scene.render();
    });

  }

  @HostListener('window:resize')
  onResize() {
      console.log("resize called");
    this.engine.resize();
  }

}
