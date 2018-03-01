import { mat4, vec2, vec4 } from 'gl-matrix';
import { gl } from '../../globals';
import { controls } from '../../main';
function frac(f) {
    return f % 1;
}
// In this file, `gl` is accessible because it is imported above
class OpenGLRenderer {
    constructor(canvas) {
        this.canvas = canvas;
    }
    setClearColor(r, g, b, a) {
        gl.clearColor(r, g, b, a);
    }
    setSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    clear() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    render(camera, prog, scenes) {
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
        prog.setColor(vec4.fromValues(controls.BranchColor[0] / 255, controls.BranchColor[1] / 255, controls.BranchColor[2] / 255, controls.BranchColor[3]));
        prog.setWindInfo(vec2.fromValues(controls.WindDirX, controls.WindDirY), controls.WindSpeed, controls.WaveWidth, controls.WindStrength, controls.BendScale);
        for (let scene of scenes) {
            if (scene.diffuseMap)
                prog.setTexture(scene.diffuseMap);
            prog.draw(scene);
        }
    }
}
;
export default OpenGLRenderer;
//# sourceMappingURL=OpenGLRenderer.js.map