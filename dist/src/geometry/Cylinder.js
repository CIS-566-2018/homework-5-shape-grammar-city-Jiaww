import { vec4 } from 'gl-matrix';
import Mesh from '../rendering/gl/Mesh';
class Cylinder extends Mesh {
    constructor(center, topRadius, bottomRadius, halfLength, subdivisions) {
        super(); // Call the constructor of the super class. This is required.
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.halfLength = halfLength;
        this.subdivisions = subdivisions;
        this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    }
    create() {
        //
        this.count = 0;
        let slope = (this.bottomRadius - this.topRadius) / (this.halfLength * 2);
        // Side Faces
        for (let i = 0; i < this.subdivisions; i++) {
            let theta = i * Math.PI * 2 / this.subdivisions;
            let nextTheta = (i + 1) * Math.PI * 2 / this.subdivisions;
            let point0 = vec4.fromValues(this.topRadius * Math.cos(theta), this.halfLength, this.topRadius * Math.sin(theta), 1);
            let point1 = vec4.fromValues(this.bottomRadius * Math.cos(theta), -this.halfLength, this.bottomRadius * Math.sin(theta), 1);
            let point2 = vec4.fromValues(this.topRadius * Math.cos(nextTheta), this.halfLength, this.topRadius * Math.sin(nextTheta), 1);
            let point3 = vec4.fromValues(this.bottomRadius * Math.cos(nextTheta), -this.halfLength, this.bottomRadius * Math.sin(nextTheta), 1);
            let thisNor1 = vec4.fromValues(Math.sin(theta), slope, Math.cos(theta), 0);
            let thisNor2 = vec4.fromValues(Math.sin(nextTheta), slope, Math.cos(nextTheta), 0);
            vec4.normalize(thisNor1, thisNor1);
            vec4.normalize(thisNor2, thisNor2);
            //Triangle 1
            this.positions.push(point0[0], point0[1], point0[2], point0[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor1[0], thisNor1[1], thisNor1[2], thisNor1[3]);
            this.positions.push(point1[0], point1[1], point1[2], point1[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor1[0], thisNor1[1], thisNor1[2], thisNor1[3]);
            this.positions.push(point2[0], point2[1], point2[2], point2[3]);
            this.uvs.push(0, 0);
            this.indices.push(this.count++);
            this.normals.push(thisNor2[0], thisNor2[1], thisNor2[2], thisNor2[3]);
            //Triangle 2
            this.positions.push(point2[0], point2[1], point2[2], point2[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor2[0], thisNor2[1], thisNor2[2], thisNor2[3]);
            this.positions.push(point1[0], point1[1], point1[2], point1[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor1[0], thisNor1[1], thisNor1[2], thisNor1[3]);
            this.positions.push(point3[0], point3[1], point3[2], point3[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor2[0], thisNor2[1], thisNor2[2], thisNor2[3]);
        }
        // Top & Bottom Face
        for (let i = 0; i < this.subdivisions; i++) {
            let theta = i * Math.PI * 2 / this.subdivisions;
            let nextTheta = (i + 1) * Math.PI * 2 / this.subdivisions;
            let point0 = vec4.fromValues(this.topRadius * Math.cos(theta), this.halfLength, this.topRadius * Math.sin(theta), 1);
            let point1 = vec4.fromValues(this.bottomRadius * Math.cos(theta), -this.halfLength, this.bottomRadius * Math.sin(theta), 1);
            let point2 = vec4.fromValues(this.topRadius * Math.cos(nextTheta), this.halfLength, this.topRadius * Math.sin(nextTheta), 1);
            let point3 = vec4.fromValues(this.bottomRadius * Math.cos(nextTheta), -this.halfLength, this.bottomRadius * Math.sin(nextTheta), 1);
            let pointCTop = vec4.fromValues(0.0, this.halfLength, 0.0, 1);
            let pointCBottom = vec4.fromValues(0.0, -this.halfLength, 0.0, 1);
            let topNor = vec4.fromValues(0, 1, 0, 1);
            let bottomNor = vec4.fromValues(0, -1, 0, 1);
            let thisNor1 = vec4.fromValues(Math.sin(theta), slope, Math.cos(theta), 0);
            let thisNor2 = vec4.fromValues(Math.sin(nextTheta), slope, Math.cos(nextTheta), 0);
            //Top
            this.positions.push(pointCTop[0], pointCTop[1], pointCTop[2], pointCTop[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(topNor[0], topNor[1], topNor[2], topNor[3]);
            this.positions.push(point0[0], point0[1], point0[2], point0[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor1[0], thisNor1[1], thisNor1[2], thisNor1[3]);
            this.positions.push(point2[0], point2[1], point2[2], point2[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor2[0], thisNor2[1], thisNor2[2], thisNor2[3]);
            //Bottom
            this.positions.push(pointCBottom[0], pointCBottom[1], pointCBottom[2], pointCBottom[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(bottomNor[0], bottomNor[1], bottomNor[2], bottomNor[3]);
            this.positions.push(point1[0], point1[1], point1[2], point1[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor1[0], thisNor1[1], thisNor1[2], thisNor1[3]);
            this.positions.push(point3[0], point3[1], point3[2], point3[3]);
            this.indices.push(this.count++);
            this.uvs.push(0, 0);
            this.normals.push(thisNor2[0], thisNor2[1], thisNor2[2], thisNor2[3]);
        }
        console.log(`Created cylinder`);
    }
}
;
export default Cylinder;
//# sourceMappingURL=Cylinder.js.map