import * as CameraControls from '3d-view-controls';
import { vec3, mat4 } from 'gl-matrix';
class Camera {
    constructor(position, target) {
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.fovy = 45;
        this.aspectRatio = 1;
        this.near = 0.1;
        this.far = 1000;
        this.position = vec3.create();
        this.direction = vec3.create();
        this.target = vec3.create();
        this.up = vec3.create();
        this.controls = CameraControls(document.getElementById('canvas'), {
            eye: position,
            center: target,
        });
        vec3.add(this.target, this.position, this.direction);
        mat4.lookAt(this.viewMatrix, this.controls.eye, this.controls.center, this.controls.up);
    }
    setAspectRatio(aspectRatio) {
        this.aspectRatio = aspectRatio;
    }
    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fovy, this.aspectRatio, this.near, this.far);
    }
    update() {
        this.controls.tick();
        vec3.add(this.target, this.position, this.direction);
        var localUp = vec3.fromValues(0.0, 1.0, 0.0);
        var viewVec = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.subtract(viewVec, this.controls.eye, this.controls.center);
        vec3.normalize(viewVec, viewVec);
        if (vec3.dot(localUp, viewVec) > 0.999)
            this.controls.up = localUp = vec3.fromValues(0.0, 0.0, -1.0);
        else
            this.controls.up = localUp;
        mat4.lookAt(this.viewMatrix, this.controls.eye, this.controls.center, this.controls.up);
        this.position = this.controls.eye;
        this.up = this.controls.up;
    }
}
;
export default Camera;
//# sourceMappingURL=Camera.js.map