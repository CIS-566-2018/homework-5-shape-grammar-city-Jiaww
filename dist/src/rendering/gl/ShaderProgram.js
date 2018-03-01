import { mat4 } from 'gl-matrix';
import { gl } from '../../globals';
var activeProgram = null;
export class Shader {
    constructor(type, source) {
        this.shader = gl.createShader(type);
        gl.shaderSource(this.shader, source);
        gl.compileShader(this.shader);
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
            throw gl.getShaderInfoLog(this.shader);
        }
    }
}
;
class ShaderProgram {
    constructor(shaders) {
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
        this.unifModel = gl.getUniformLocation(this.prog, "u_Model");
        this.unifModelInvTr = gl.getUniformLocation(this.prog, "u_ModelInvTr");
        this.unifViewProj = gl.getUniformLocation(this.prog, "u_ViewProj");
        this.unifTime = gl.getUniformLocation(this.prog, "u_Time");
        this.unifTrig = gl.getUniformLocation(this.prog, "u_Trig");
        this.unifWindDir = gl.getUniformLocation(this.prog, "u_WindDir");
        this.unifWindSpeed = gl.getUniformLocation(this.prog, "u_WindSpeed");
        this.unifWaveWidth = gl.getUniformLocation(this.prog, "u_WaveWidth");
        this.unifWindStrength = gl.getUniformLocation(this.prog, "u_WindStrength");
        this.unifBendScale = gl.getUniformLocation(this.prog, "u_BendScale");
        this.unifColor = gl.getUniformLocation(this.prog, "u_Color");
        this.unifDiffuseMap = gl.getUniformLocation(this.prog, "u_DiffuseMap");
    }
    use() {
        if (activeProgram !== this.prog) {
            gl.useProgram(this.prog);
            activeProgram = this.prog;
        }
    }
    setModelMatrix(model) {
        this.use();
        if (this.unifModel !== -1) {
            gl.uniformMatrix4fv(this.unifModel, false, model);
        }
        if (this.unifModelInvTr !== -1) {
            let modelinvtr = mat4.create();
            mat4.transpose(modelinvtr, model);
            mat4.invert(modelinvtr, modelinvtr);
            gl.uniformMatrix4fv(this.unifModelInvTr, false, modelinvtr);
        }
    }
    setViewProjMatrix(vp) {
        this.use();
        if (this.unifViewProj !== -1) {
            gl.uniformMatrix4fv(this.unifViewProj, false, vp);
        }
    }
    setColor(color) {
        this.use();
        if (this.unifColor !== -1) {
            gl.uniform4fv(this.unifColor, color);
        }
    }
    setTexture(texture) {
        this.use();
        if (this.unifDiffuseMap !== -1) {
            gl.uniform1i(this.unifDiffuseMap, 0);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
        }
    }
    updateTime(time) {
        this.use();
        if (this.unifTime !== -1) {
            gl.uniform1f(this.unifTime, time);
        }
    }
    setTrig(trig) {
        this.use();
        if (this.unifTrig !== -1) {
            if (trig) {
                gl.uniform1f(this.unifTrig, 1);
            }
            else {
                gl.uniform1f(this.unifTrig, 0);
            }
        }
    }
    setWindInfo(windDir, windSpeed, waveWidth, windStrength, bendscale) {
        this.use();
        if (this.unifWindDir !== -1) {
            gl.uniform2fv(this.unifWindDir, windDir);
        }
        if (this.unifWindSpeed !== -1) {
            gl.uniform1f(this.unifWindSpeed, windSpeed);
        }
        if (this.unifWaveWidth !== -1) {
            gl.uniform1f(this.unifWaveWidth, waveWidth);
        }
        if (this.unifWindStrength !== -1) {
            gl.uniform1f(this.unifWindStrength, windStrength);
        }
        if (this.unifBendScale !== -1) {
            gl.uniform1f(this.unifBendScale, bendscale);
        }
    }
    draw(d) {
        this.use();
        if (this.attrPos != -1 && d.bindPos()) {
            gl.enableVertexAttribArray(this.attrPos);
            gl.vertexAttribPointer(this.attrPos, 4, gl.FLOAT, false, 0, 0);
        }
        if (this.attrNor != -1 && d.bindNor()) {
            gl.enableVertexAttribArray(this.attrNor);
            gl.vertexAttribPointer(this.attrNor, 4, gl.FLOAT, false, 0, 0);
        }
        if (this.attrUv != -1 && d.bindUv()) {
            gl.enableVertexAttribArray(this.attrUv);
            gl.vertexAttribPointer(this.attrUv, 2, gl.FLOAT, false, 0, 0);
        }
        d.bindIdx();
        gl.drawElements(d.drawMode(), d.elemCount(), gl.UNSIGNED_INT, 0);
        if (this.attrPos != -1)
            gl.disableVertexAttribArray(this.attrPos);
        if (this.attrNor != -1)
            gl.disableVertexAttribArray(this.attrNor);
        if (this.attrUv != -1)
            gl.disableVertexAttribArray(this.attrUv);
    }
}
;
export default ShaderProgram;
//# sourceMappingURL=ShaderProgram.js.map