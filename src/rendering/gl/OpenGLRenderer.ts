import {mat4, vec2, vec3, vec4} from 'gl-matrix';
import Scene from './Scene';
import Camera from '../../Camera';
import {gl} from '../../globals';
import ShaderProgram from './ShaderProgram';
import {controls} from '../../main'

  function frac(f : number) {
    return f % 1;
  }

// In this file, `gl` is accessible because it is imported above
class OpenGLRenderer {
  constructor(public canvas: HTMLCanvasElement) {
  }

  setClearColor(r: number, g: number, b: number, a: number) {
    gl.clearColor(r, g, b, a);
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }


  render(camera: Camera, prog: ShaderProgram, scenes: Array<Scene>) {
    let PI = 3.14159265359;
    let model = mat4.create();
    let viewProj = mat4.create();
    var d = new Date();
    let time = ((d.getTime()) / 1000.0) * 1.3;
    mat4.identity(model);
    let idm = mat4.create();
    mat4.identity(idm);

    mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);
    prog.setModelMatrix(model);
    prog.setViewProjMatrix(viewProj);
    prog.updateTime(Math.sin(time));
    prog.setColor(vec4.fromValues(controls.BaseColor[0]/255,controls.BaseColor[1]/255,controls.BaseColor[2]/255,controls.BaseColor[3]));
    prog.setShowTrigs(controls.ShowDensity, controls.ShowTexture);

    for (let scene of scenes) {
      if (scene.diffuseMap)
        prog.setTexture(scene.diffuseMap);
      prog.draw(scene);
    }
  }
};

export default OpenGLRenderer;
