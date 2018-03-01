import { vec4 } from 'gl-matrix';
import Mesh from '../rendering/gl/Mesh';
class Plane extends Mesh {
    constructor(center, dim) {
        super(); // Call the constructor of the super class. This is required.
        this.dim = dim;
        this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    }
    create() {
        //
        this.count = 6;
        this.positions.push(-0.5 * this.dim, 0, -0.5 * this.dim, 1);
        this.positions.push(+0.5 * this.dim, 0, -0.5 * this.dim, 1);
        this.positions.push(+0.5 * this.dim, 0, +0.5 * this.dim, 1);
        this.positions.push(-0.5 * this.dim, 0, +0.5 * this.dim, 1);
        this.normals.push(0, 1, 0, 1);
        this.normals.push(0, 1, 0, 1);
        this.normals.push(0, 1, 0, 1);
        this.normals.push(0, 1, 0, 1);
        this.uvs.push(0, 0);
        this.uvs.push(1, 0);
        this.uvs.push(1, 1);
        this.uvs.push(0, 1);
        this.indices.push(0, 1, 2, 0, 2, 3);
        console.log(`Created plane`);
    }
}
;
export default Plane;
//# sourceMappingURL=Plane.js.map