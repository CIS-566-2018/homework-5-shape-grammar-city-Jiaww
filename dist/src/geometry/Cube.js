import { vec3, vec4 } from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import { gl } from '../globals';
class Cube extends Drawable {
    constructor(center) {
        super(); // Call the constructor of the super class. This is required.
        this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    }
    create() {
        // 6 faces
        this.indices = new Uint32Array([0, 1, 2,
            0, 2, 3,
            4, 5, 6,
            4, 6, 7,
            8, 9, 10,
            8, 10, 11,
            12, 13, 14,
            12, 14, 15,
            16, 17, 18,
            16, 18, 19,
            20, 21, 22,
            20, 22, 23]);
        // 24 vertices
        this.normals = new Float32Array([0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 0, 1, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            0, 1, 0, 0,
            1, 0, 0, 0,
            1, 0, 0, 0,
            1, 0, 0, 0,
            1, 0, 0, 0,
            0, 0, -1, 0,
            0, 0, -1, 0,
            0, 0, -1, 0,
            0, 0, -1, 0,
            0, -1, 0, 0,
            0, -1, 0, 0,
            0, -1, 0, 0,
            0, -1, 0, 0,
            -1, 0, 0, 0,
            -1, 0, 0, 0,
            -1, 0, 0, 0,
            -1, 0, 0, 0]);
        this.positions = new Float32Array([-1, -1, 1, 1,
            1, -1, 1, 1,
            1, 1, 1, 1,
            -1, 1, 1, 1,
            -1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, -1, 1,
            -1, 1, -1, 1,
            1, 1, 1, 1,
            1, -1, 1, 1,
            1, -1, -1, 1,
            1, 1, -1, 1,
            -1, -1, -1, 1,
            -1, 1, -1, 1,
            1, 1, -1, 1,
            1, -1, -1, 1,
            -1, -1, 1, 1,
            -1, -1, -1, 1,
            1, -1, -1, 1,
            1, -1, 1, 1,
            -1, -1, 1, 1,
            -1, 1, 1, 1,
            -1, 1, -1, 1,
            -1, -1, -1, 1]);
        //tri-color
        var col1 = vec3.fromValues(223 / 255, 69 / 255, 117 / 255);
        var col2 = vec3.fromValues(73 / 255, 58 / 255, 86 / 255);
        var col3 = vec3.fromValues(164 / 255, 213 / 255, 192 / 255);
        this.colors = new Float32Array([col1[0], col1[1], col1[2], 1,
            col1[0], col1[1], col1[2], 1,
            col1[0], col1[1], col1[2], 1,
            col1[0], col1[1], col1[2], 1,
            col2[0], col2[1], col2[2], 1,
            col2[0], col2[1], col2[2], 1,
            col2[0], col2[1], col2[2], 1,
            col2[0], col2[1], col2[2], 1,
            col3[0], col3[1], col3[2], 1,
            col3[0], col3[1], col3[2], 1,
            col3[0], col3[1], col3[2], 1,
            col3[0], col3[1], col3[2], 1,
            col1[0], col1[1], col1[2], 1,
            col1[0], col1[1], col1[2], 1,
            col1[0], col1[1], col1[2], 1,
            col1[0], col1[1], col1[2], 1,
            col2[0], col2[1], col2[2], 1,
            col2[0], col2[1], col2[2], 1,
            col2[0], col2[1], col2[2], 1,
            col2[0], col2[1], col2[2], 1,
            col3[0], col3[1], col3[2], 1,
            col3[0], col3[1], col3[2], 1,
            col3[0], col3[1], col3[2], 1,
            col3[0], col3[1], col3[2], 1]);
        this.generateIdx();
        this.generatePos();
        this.generateNor();
        this.generateCol();
        this.count = this.indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
        console.log(`Created cube`);
    }
}
;
export default Cube;
//# sourceMappingURL=Cube.js.map