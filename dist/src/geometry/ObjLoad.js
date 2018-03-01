import { vec4 } from 'gl-matrix';
import Mesh from '../rendering/gl/Mesh';
import * as WEBGLOBJLOADER from 'webgl-obj-loader';
class ObjLoad extends Mesh {
    constructor(center) {
        super(); // Call the constructor of the super class. This is required.
        this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    }
    create() {
        //
        this.count = 0;
    }
    createdByLoader(stringParam) {
        console.log("branch created");
        var outResult;
        let errMsg;
        let posArray;
        posArray = [];
        let norArray;
        norArray = [];
        let indexArray;
        indexArray = [];
        let uvArray;
        uvArray = [];
        let bLoaded = false;
        var mesh = new WEBGLOBJLOADER.Mesh(stringParam);
        posArray = mesh.vertices;
        norArray = mesh.vertexNormals;
        indexArray = mesh.indices;
        uvArray = mesh.textures;
        for (let i = 0; i < posArray.length; i += 3) {
            this.positions.push(posArray[i], posArray[i + 1], posArray[i + 2], 1);
            this.normals.push(norArray[i], norArray[i + 1], norArray[i + 2], 0);
        }
        this.indices = indexArray;
        this.uvs = uvArray;
        this.count = this.indices.length;
    }
}
;
export default ObjLoad;
//# sourceMappingURL=ObjLoad.js.map