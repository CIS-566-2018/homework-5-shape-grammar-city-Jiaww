import {gl} from '../../globals';
import {mat4, vec3, vec4} from 'gl-matrix';
import Mesh from 'rendering/gl/Mesh';

class Scene{
  indices: Array<number> = [];
  positions: Array<number> = [];
  normals: Array<number> = [];
  uvs: Array<number> = [];
  center: vec4;
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;
  bufUv: WebGLBuffer;
  
  diffuseMap: WebGLTexture = null;

  idxBound: boolean = false;
  posBound: boolean = false;
  norBound: boolean = false;
  uvBound: boolean = false;
  diffuseMapBound: boolean = false;

  constructor() {
  }

  add(mesh:Mesh, model: mat4, curDens:number){
  	let modelinvtr: mat4 = mat4.create();
    mat4.transpose(modelinvtr, model);
    mat4.invert(modelinvtr, modelinvtr);
    let indicesCount = this.indices.length;
  	for(let i = 0; i < mesh.indices.length; i++){
  		this.indices.push(mesh.indices[i]+indicesCount);
  		let thisPos = vec4.fromValues(mesh.positions[4*i],mesh.positions[4*i+1],mesh.positions[4*i+2],mesh.positions[4*i+3]);
  		vec4.transformMat4(thisPos, thisPos, model);
      // put current dens info into 4th value of the position
  		this.positions.push(thisPos[0],thisPos[1],thisPos[2],curDens);
  		let thisNor = vec4.fromValues(mesh.normals[4*i],mesh.normals[4*i+1],mesh.normals[4*i+2],mesh.normals[4*i+3]);
  		vec4.transformMat4(thisNor, thisNor, modelinvtr);
  		vec4.normalize(thisNor, thisNor);
  		this.normals.push(thisNor[0],thisNor[1],thisNor[2],thisNor[3]);
  		this.uvs.push(mesh.uvs[2*i], mesh.uvs[2*i+1]);
  	}
  }

  createBuffer(){
	  this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateUv();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint32Array.from(this.indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(this.normals), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(this.positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUv);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(this.uvs), gl.STATIC_DRAW);

    console.log(`Created Scene`);  
}

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);
    gl.deleteBuffer(this.bufUv);
    gl.deleteTexture(this.diffuseMap);
 }

  generateIdx() {
    this.idxBound = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posBound = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norBound = true;
    this.bufNor = gl.createBuffer();
  }

  generateUv() {
    this.uvBound = true;
    this.bufUv = gl.createBuffer();
  }

  // generateTexture() { 
  //   this.diffuseMapBound = true;
  // }

  bindIdx(): boolean {
    if (this.idxBound) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxBound;
  }

  bindPos(): boolean {
    if (this.posBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posBound;
  }

  bindNor(): boolean {
    if (this.norBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norBound;
  }

  bindUv(): boolean {
    if (this.uvBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUv);
    }
    return this.uvBound;
  }

  bindTex(url:string)
  {   
    const texture = gl.createTexture();

    const image = new Image();
    image.onload = function() {
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	    //gl.generateMipmap(gl.TEXTURE_2D);

	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	    gl.bindTexture(gl.TEXTURE_2D, null);
	    
    }

    image.src = url;
    this.diffuseMap = texture;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }
}

export default Scene;
