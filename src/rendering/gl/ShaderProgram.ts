import {vec4, vec2, mat4} from 'gl-matrix';
import Scene from './Scene';
import {gl} from '../../globals';

var activeProgram: WebGLProgram = null;

export class Shader {
  shader: WebGLShader;

  constructor(type: number, source: string) {
    this.shader = gl.createShader(type);
    gl.shaderSource(this.shader, source);
    gl.compileShader(this.shader);

    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(this.shader);
    }
  }
};

class ShaderProgram {
  prog: WebGLProgram;

  attrPos: number;
  attrNor: number;
  attrCol: number;
  attrUv: number;

  unifModel: WebGLUniformLocation;
  unifModelInvTr: WebGLUniformLocation;
  unifViewProj: WebGLUniformLocation;
  unifTime: WebGLUniformLocation;
  unifTrig: WebGLUniformLocation;
  unifResolution: WebGLUniformLocation;
  unifDiffuseMap: WebGLUniformLocation;
  unifColor: WebGLUniformLocation;
  unifShowDensity: WebGLUniformLocation;
  unifShowTexture: WebGLUniformLocation;

  constructor(shaders: Array<Shader>) {
    this.prog = gl.createProgram();

    for (let shader of shaders) {
      gl.attachShader(this.prog, shader.shader);
    }
    gl.linkProgram(this.prog);
    if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.prog);
    }

    this.attrPos = gl.getAttribLocation(this.prog, "vs_Pos");
    this.attrNor = gl.getAttribLocation(this.prog, "vs_Nor");
    this.attrCol = gl.getAttribLocation(this.prog, "vs_Col");
    this.attrUv = gl.getAttribLocation(this.prog, "vs_Uv");
    this.unifModel      = gl.getUniformLocation(this.prog, "u_Model");
    this.unifModelInvTr = gl.getUniformLocation(this.prog, "u_ModelInvTr");
    this.unifViewProj   = gl.getUniformLocation(this.prog, "u_ViewProj");
    this.unifTime       = gl.getUniformLocation(this.prog, "u_Time");
    this.unifTrig       = gl.getUniformLocation(this.prog, "u_Trig");
    this.unifColor = gl.getUniformLocation(this.prog, "u_Color");
    this.unifShowDensity = gl.getUniformLocation(this.prog, "u_ShowDensity");
    this.unifShowTexture = gl.getUniformLocation(this.prog, "u_ShowTexture");
    this.unifDiffuseMap = gl.getUniformLocation(this.prog, "u_DiffuseMap");
}

  use() {
    if (activeProgram !== this.prog) {
      gl.useProgram(this.prog);
      activeProgram = this.prog;
    }
  }

  setModelMatrix(model: mat4) {
    this.use();
    if (this.unifModel !== -1) {
      gl.uniformMatrix4fv(this.unifModel, false, model);
    }

    if (this.unifModelInvTr !== -1) {
      let modelinvtr: mat4 = mat4.create();
      mat4.transpose(modelinvtr, model);
      mat4.invert(modelinvtr, modelinvtr);
      gl.uniformMatrix4fv(this.unifModelInvTr, false, modelinvtr);
    }
  }

  setViewProjMatrix(vp: mat4) {
    this.use();
    if (this.unifViewProj !== -1) {
      gl.uniformMatrix4fv(this.unifViewProj, false, vp);
    }
  }

  setColor(color: vec4){
    this.use();
    if (this.unifColor !== -1){
      gl.uniform4fv(this.unifColor, color);
    }
  }

  setTexture(texture: WebGLTexture) {
      this.use();
      if (this.unifDiffuseMap !== -1) {

        gl.uniform1i(this.unifDiffuseMap, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
      }
  }

  setShowTrigs(showDensity: boolean, showTexture:boolean){
    this.use();
      if (this.unifShowDensity !== -1) {
        if (showDensity)
          gl.uniform1i(this.unifShowDensity, 1);
        else
          gl.uniform1i(this.unifShowDensity, 0);
      }
      if (this.unifShowTexture !== -1) {
        if (showTexture)
          gl.uniform1i(this.unifShowTexture, 1);
        else
          gl.uniform1i(this.unifShowTexture, 0);
      }
  }

  updateTime(time: number){
    this.use();
    if (this.unifTime !== -1){
      gl.uniform1f(this.unifTime, time);
    }
  }

  setTrig(trig: boolean) {
    this.use();
    if (this.unifTrig !== -1) {
      if (trig){
        gl.uniform1f(this.unifTrig, 1);
      }
      else{
        gl.uniform1f(this.unifTrig, 0);
      }
    }
  }

  draw(d: Scene) {
    this.use();

    if (this.attrPos != -1 && d.bindPos()) {
      gl.enableVertexAttribArray(this.attrPos);
      gl.vertexAttribPointer(this.attrPos, 4, gl.FLOAT, false, 0, 0);
    }

    if (this.attrNor != -1 && d.bindNor()) {
      gl.enableVertexAttribArray(this.attrNor);
      gl.vertexAttribPointer(this.attrNor, 4, gl.FLOAT, false, 0, 0);
    }

    if (this.attrUv != -1 && d.bindUv()){
      gl.enableVertexAttribArray(this.attrUv);
      gl.vertexAttribPointer(this.attrUv, 2, gl.FLOAT, false, 0, 0);
    }

    d.bindIdx();
    
    gl.drawElements(d.drawMode(), d.elemCount(), gl.UNSIGNED_INT, 0);

    if (this.attrPos != -1) gl.disableVertexAttribArray(this.attrPos);
    if (this.attrNor != -1) gl.disableVertexAttribArray(this.attrNor);
    if (this.attrUv != -1) gl.disableVertexAttribArray(this.attrUv);
  }
};

export default ShaderProgram;
