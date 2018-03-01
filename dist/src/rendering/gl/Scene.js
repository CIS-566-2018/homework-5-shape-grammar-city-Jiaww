import { gl } from '../../globals';
import { mat4, vec4 } from 'gl-matrix';
class Scene {
    constructor() {
        this.indices = [];
        this.positions = [];
        this.normals = [];
        this.uvs = [];
        this.count = 0;
        this.diffuseMap = null;
        this.idxBound = false;
        this.posBound = false;
        this.norBound = false;
        this.uvBound = false;
        this.diffuseMapBound = false;
    }
    add(mesh, model) {
        let modelinvtr = mat4.create();
        mat4.transpose(modelinvtr, model);
        mat4.invert(modelinvtr, modelinvtr);
        let indicesCount = this.indices.length;
        for (let i = 0; i < mesh.indices.length; i++) {
            this.indices.push(mesh.indices[i] + indicesCount);
            let thisPos = vec4.fromValues(mesh.positions[4 * i], mesh.positions[4 * i + 1], mesh.positions[4 * i + 2], mesh.positions[4 * i + 3]);
            vec4.transformMat4(thisPos, thisPos, model);
            this.positions.push(thisPos[0], thisPos[1], thisPos[2], thisPos[3]);
            let thisNor = vec4.fromValues(mesh.normals[4 * i], mesh.normals[4 * i + 1], mesh.normals[4 * i + 2], mesh.normals[4 * i + 3]);
            vec4.transformMat4(thisNor, thisNor, modelinvtr);
            vec4.normalize(thisNor, thisNor);
            this.normals.push(thisNor[0], thisNor[1], thisNor[2], thisNor[3]);
            this.uvs.push(mesh.uvs[2 * i], mesh.uvs[2 * i + 1]);
        }
    }
    createBuffer() {
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
    bindIdx() {
        if (this.idxBound) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        }
        return this.idxBound;
    }
    bindPos() {
        if (this.posBound) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        }
        return this.posBound;
    }
    bindNor() {
        if (this.norBound) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        }
        return this.norBound;
    }
    bindUv() {
        if (this.uvBound) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUv);
        }
        return this.uvBound;
    }
    bindTex(url) {
        const texture = gl.createTexture();
        const image = new Image();
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            //gl.generateMipmap(gl.TEXTURE_2D);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        image.src = url;
        this.diffuseMap = texture;
    }
    elemCount() {
        return this.count;
    }
    drawMode() {
        return gl.TRIANGLES;
    }
}
export default Scene;
//# sourceMappingURL=Scene.js.map