import {quat, vec3, vec4, mat4} from 'gl-matrix';
import Scene from './rendering/gl/Scene';
import {Building} from './LSystem';
import Mesh from './rendering/gl/Mesh';

export function Turtle(scene: Scene, building: Building, worldModel: mat4, iteration: number,
		base: Mesh, mid: Mesh, mid_2: Mesh, roof: Mesh, window: Mesh, 
		curDens: number){

	building.process(iteration);
	for (let i = 0; i < building.ShapeSet.length; i++){
	    let modelMat = mat4.create();
	    let scaleMat = mat4.create();
	    let rotQuat = quat.create();
	    let rotMat = mat4.create();
	    let transMat = mat4.create(); 
	    mat4.scale(scaleMat, scaleMat, building.ShapeSet[i].scale);
	    quat.fromEuler(rotQuat, building.ShapeSet[i].rot[0], building.ShapeSet[i].rot[1], building.ShapeSet[i].rot[2]);
	    mat4.fromQuat(rotMat, rotQuat);
	    mat4.translate(transMat, transMat, building.ShapeSet[i].pos);
	    mat4.multiply(modelMat, scaleMat, modelMat);
	    mat4.multiply(modelMat, rotMat, modelMat);
	    mat4.multiply(modelMat, transMat, modelMat);
	    mat4.multiply(modelMat, worldModel, modelMat);
	    if (building.ShapeSet[i].geometry == "base"){
	      	scene.add(base, modelMat, curDens);
	    }
	    else if(building.ShapeSet[i].geometry == "mid"){
	      	scene.add(mid, modelMat, curDens);
	    }
	    else if(building.ShapeSet[i].geometry == "mid_2"){
	      	scene.add(mid_2, modelMat, curDens);
	    }
	    else if(building.ShapeSet[i].geometry == "roof"){
	      	scene.add(roof, modelMat, curDens);
	    }
	    else if(building.ShapeSet[i].geometry == "window"){
	    	scene.add(window, modelMat, curDens);
	    }
	  }

}