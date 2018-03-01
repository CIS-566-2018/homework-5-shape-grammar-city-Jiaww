import { vec3 } from 'gl-matrix';
class Rule {
    constructor(probility, func) {
        this.probility = probility;
        this.func = func;
        this.probility = probility;
        this.func = func;
    }
}
class Shape {
    constructor(predecessor, symbol, geometry, pos, rot, scale, xaxis, zaxis) {
        this.predecessor = predecessor;
        this.symbol = symbol;
        this.geometry = geometry;
        this.pos = pos;
        this.rot = rot;
        this.scale = scale;
        this.xaxis = xaxis;
        this.zaxis = zaxis;
        this.predecessor = predecessor;
        this.symbol = symbol;
        this.geometry = geometry;
        this.pos = pos;
        this.rot = rot;
        this.scale = scale;
        this.xaxis = xaxis;
        this.zaxis = zaxis;
    }
}
class Building {
    constructor() {
        this.ShapeSet = [];
        this.Iterations = [];
    }
    addBase(objName) {
        this.ShapeSet.push(new Shape(this.Root, 'B', objName, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
        this.TopHeight += 1;
        this.BaseHeight = 1;
    }
    addRoof(objName) {
        this.ShapeSet.push(new Shape(this.Root, 'R', objName, vec3.fromValues(0, this.TopHeight, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
    }
}
// Repeat
function f1(predecessor, angle) {
    let rand = Math.random();
    if (rand < 0.8) {
        let newXaxis = vec3.create();
        let newZaxis = vec3.create();
        let rotAngle = angle;
        vec3.rotateY(newXaxis, predecessor.xaxis, [0, 0, 0], rotAngle / 180 * Math.PI);
        vec3.rotateY(newZaxis, predecessor.zaxis, [0, 0, 0], rotAngle / 180 * Math.PI);
        vec3.normalize(newXaxis, newXaxis);
        vec3.normalize(newZaxis, newZaxis);
        let successor = new Shape(predecessor, predecessor.symbol, predecessor.geometry, vec3.fromValues(predecessor.pos[0], predecessor.pos[1] + 1, predecessor.pos[2]), vec3.fromValues(predecessor.rot[0], predecessor.rot[1] + rotAngle, predecessor.rot[2]), predecessor.scale, newXaxis, newZaxis);
        return successor;
    }
    else {
        let newXaxis = predecessor.xaxis;
        let newZaxis = predecessor.zaxis;
        let successor = new Shape(predecessor, predecessor.symbol, predecessor.geometry, vec3.fromValues(predecessor.pos[0], predecessor.pos[1] + 1, predecessor.pos[2]), vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]), predecessor.scale, newXaxis, newZaxis);
        return successor;
    }
}
// Add Windows(building 1)
function f2(predecessor) {
    let rand = Math.random();
    let successors = Array();
    if (rand < 0.6) {
        // 8 Windows(4 each side)
        let oriPos = predecessor.pos;
        let newPos = vec3.create();
        for (let i = 0; i < 4; i++) {
            vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2] * 1.0);
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0] * (0.6 - 0.4 * i));
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.25, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.15, predecessor.scale[1] * 0.5, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
        // Back Side
        for (let i = 0; i < 4; i++) {
            vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2] * -1.0);
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0] * (0.6 - 0.4 * i));
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.25, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.15, predecessor.scale[1] * 0.5, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
    }
    else {
        // 6 Windiws(3 each side)
        let oriPos = predecessor.pos;
        let newPos = vec3.create();
        for (let i = 0; i < 3; i++) {
            vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2] * 1.0);
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0] * (0.5 - 0.5 * i));
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.25, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.15, predecessor.scale[1] * 0.5, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
        // Back Side
        for (let i = 0; i < 3; i++) {
            vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2] * -1.0);
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0] * (0.5 - 0.5 * i));
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.25, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.15, predecessor.scale[1] * 0.5, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
    }
    return successors;
}
export class Building1 extends Building {
    constructor(center) {
        super();
        this.Center = center;
        this.BaseHeight = 1.0;
        this.TopHeight = 0.0;
        this.Root = new Shape(null, 'Root', 'root', this.Center, vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1));
        // this.ShapeSet = [
        // new Shape("B", "base", center, vec3.fromValues(0,0,0), vec3.fromValues(1,1,1), vec3.fromValues(1,0,0), vec3.fromValues(0,0,1)),
        // new Shape("M", "mid", vec3.fromValues(center[0],this.BaseHeight,center[2]), vec3.fromValues(0,0,0), vec3.fromValues(1,1,1), vec3.fromValues(1,0,0), vec3.fromValues(0,0,1)),
        // new Shape("T", "Top", vec3.fromValues(center[0],this.TopHeight,center[2]), vec3.fromValues(0,0,0), vec3.fromValues(1,1,1), vec3.fromValues(1,0,0), vec3.fromValues(0,0,1))];
        this.Productions = new Map();
        this.Productions.set('M', new Rule(1.0, f1));
        //Windows
        this.Productions.set('MEW', new Rule(1.0, f2));
        this.Productions.set('MW', new Rule(1.0, f2));
    }
    process(n) {
        this.addBase('base');
        for (let i = 0; i < n; i++) {
            if (i == 0) {
                this.ShapeSet.push(new Shape(this.Root, 'M', 'mid', vec3.fromValues(0, this.BaseHeight, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
                this.TopHeight += 1;
            }
            else {
                var curLength = this.ShapeSet.length;
                for (let j = 0; j < curLength; j++) {
                    if (this.Productions.has(this.ShapeSet[j].symbol)) {
                        var successor = this.Productions.get(this.ShapeSet[j].symbol).func(this.ShapeSet[j], 7.5);
                        this.ShapeSet[j].symbol = this.ShapeSet[j].symbol + 'E';
                        this.ShapeSet.push(successor);
                        this.TopHeight += 1;
                    }
                }
            }
        }
        // Add Windows
        var curLength = this.ShapeSet.length;
        for (let i = 0; i < curLength; i++) {
            if (this.Productions.has(this.ShapeSet[i].symbol + "W")) {
                var successors = this.Productions.get(this.ShapeSet[i].symbol + "W").func(this.ShapeSet[i]);
                for (let j = 0; j < successors.length; j++) {
                    this.ShapeSet.push(successors[j]);
                }
                this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
            }
        }
        this.addRoof('roof');
    }
}
// Add windows building 2
function f3(predecessor) {
    let rand = Math.random();
    let successors = Array();
    if (rand < 1.0) {
        // (1 Windows each side)
        let oriPos = predecessor.pos;
        let newPos = vec3.create();
        for (let i = 0; i < 10; i++) {
            let theta = (2 * Math.PI) / 10 * i - Math.PI / 4;
            let curZaxis = vec3.create();
            let curXaxis = vec3.create();
            vec3.rotateY(curZaxis, predecessor.zaxis, vec3.fromValues(0, 0, 0), theta);
            vec3.rotateY(curXaxis, predecessor.xaxis, vec3.fromValues(0, 0, 0), theta);
            vec3.scaleAndAdd(newPos, oriPos, curZaxis, predecessor.scale[2] * 1.25);
            vec3.scaleAndAdd(newPos, newPos, curXaxis, predecessor.scale[0] * 1.25);
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.25, newPos[2]), vec3.fromValues(predecessor.rot[0], predecessor.rot[1] + (theta / Math.PI * 180 - 45), predecessor.rot[2]), vec3.fromValues(predecessor.scale[0] * 0.15, predecessor.scale[1] * 0.5, predecessor.scale[2] * 0.2), predecessor.xaxis, predecessor.zaxis));
        }
    }
    return successors;
}
export class Building2 extends Building {
    constructor(center) {
        super();
        this.Center = center;
        this.BaseHeight = 1.0;
        this.TopHeight = 0.0;
        this.Root = new Shape(null, 'Root', 'root', this.Center, vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1));
        this.Productions = new Map();
        this.Productions.set('M', new Rule(1.0, f1));
        //Windows
        this.Productions.set('MEW', new Rule(1.0, f3));
        this.Productions.set('MW', new Rule(1.0, f3));
    }
    process(n) {
        this.addBase('torus_base');
        for (let i = 0; i < n; i++) {
            if (i == 0) {
                this.ShapeSet.push(new Shape(this.Root, 'M', 'torus_mid', vec3.fromValues(0, this.BaseHeight, 0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
                this.TopHeight += 1;
            }
            else {
                var curLength = this.ShapeSet.length;
                for (let j = 0; j < curLength; j++) {
                    if (this.Productions.has(this.ShapeSet[j].symbol)) {
                        var successor = this.Productions.get(this.ShapeSet[j].symbol).func(this.ShapeSet[j], 0);
                        this.ShapeSet[j].symbol = this.ShapeSet[j].symbol + 'E';
                        this.ShapeSet.push(successor);
                        this.TopHeight += 1;
                    }
                }
            }
        }
        // Add Windows
        var curLength = this.ShapeSet.length;
        for (let i = 0; i < curLength; i++) {
            if (this.Productions.has(this.ShapeSet[i].symbol + "W")) {
                var successors = this.Productions.get(this.ShapeSet[i].symbol + "W").func(this.ShapeSet[i]);
                for (let j = 0; j < successors.length; j++) {
                    this.ShapeSet.push(successors[j]);
                }
                this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
            }
        }
        this.addRoof('torus_roof');
    }
}
function f4(predecessor) {
    let newXaxis = vec3.create();
    let newZaxis = vec3.create();
    let offset = predecessor.pos[2] + 1.0;
    if (offset > 1.0)
        offset = -1.0;
    let successor = new Shape(predecessor, predecessor.symbol, predecessor.geometry, vec3.fromValues(predecessor.pos[0], predecessor.pos[1] + 1, offset), vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]), predecessor.scale, newXaxis, newZaxis);
    return successor;
}
function f5(predecessor) {
    let successors = Array();
    // 8 Windows(4 each side)
    let oriPos = predecessor.pos;
    let newPos = vec3.create();
    // Front Side
    for (let i = 0; i < 3; i++) {
        let rand = Math.random();
        if (rand < 0.8) {
            vec3.scaleAndAdd(newPos, oriPos, [0, 0, 1], predecessor.scale[2] * (-0.25 + 0.25 * i));
            vec3.scaleAndAdd(newPos, newPos, [1, 0, 0], predecessor.scale[0] * 1.5);
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.6, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.05, predecessor.scale[1] * 0.2, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
    }
    for (let i = 0; i < 3; i++) {
        let rand = Math.random();
        if (rand < 0.8) {
            vec3.scaleAndAdd(newPos, oriPos, [0, 0, 1], predecessor.scale[2] * (-0.25 + 0.25 * i));
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0] * 1.5);
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.3, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.05, predecessor.scale[1] * 0.2, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
    }
    // Back Side
    for (let i = 0; i < 3; i++) {
        let rand = Math.random();
        if (rand < 0.75) {
            vec3.scaleAndAdd(newPos, oriPos, [0, 0, 1], predecessor.scale[2] * (-0.25 + 0.25 * i));
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, -predecessor.scale[0] * 1.5);
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.6, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.05, predecessor.scale[1] * 0.2, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
    }
    for (let i = 0; i < 3; i++) {
        let rand = Math.random();
        if (rand < 0.8) {
            vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2] * (-0.25 + 0.25 * i));
            vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, -predecessor.scale[0] * 1.5);
            successors.push(new Shape(predecessor, "W", 'base', vec3.fromValues(newPos[0], newPos[1] + predecessor.scale[1] * 0.3, newPos[2]), predecessor.rot, vec3.fromValues(predecessor.scale[0] * 0.05, predecessor.scale[1] * 0.2, predecessor.scale[2] * 0.1), predecessor.xaxis, predecessor.zaxis));
        }
    }
    return successors;
}
export class Building3 extends Building {
    constructor(center) {
        super();
        this.Center = center;
        this.BaseHeight = 1.0;
        this.TopHeight = 0.0;
        this.Root = new Shape(null, 'Root', 'root', this.Center, vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1));
        this.Productions = new Map();
        this.Productions.set('M', new Rule(1.0, f4));
        //Windows
        this.Productions.set('MEW', new Rule(1.0, f5));
        this.Productions.set('MW', new Rule(1.0, f5));
    }
    process(n) {
        this.addBase('base3');
        this.BaseHeight = 0.08;
        this.TopHeight = 0.08;
        for (let i = 0; i < n; i++) {
            if (i == 0) {
                this.ShapeSet.push(new Shape(this.Root, 'M', 'mid3', vec3.fromValues(-0.25, this.BaseHeight, 1.0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
                this.ShapeSet.push(new Shape(this.Root, 'M', 'mid3', vec3.fromValues(0, this.BaseHeight, 0.0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
                this.ShapeSet.push(new Shape(this.Root, 'M', 'mid3', vec3.fromValues(0.25, this.BaseHeight, -1.0), vec3.fromValues(0, 0, 0), vec3.fromValues(1, 1, 1), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 0, 1)));
                this.TopHeight += 1;
            }
            else {
                var curLength = this.ShapeSet.length;
                for (let j = 0; j < curLength; j++) {
                    if (this.Productions.has(this.ShapeSet[j].symbol)) {
                        var successor = this.Productions.get(this.ShapeSet[j].symbol).func(this.ShapeSet[j], 0);
                        this.ShapeSet[j].symbol = this.ShapeSet[j].symbol + 'E';
                        this.ShapeSet.push(successor);
                        this.TopHeight += 1 / 3;
                    }
                }
            }
        }
        // Add Windows
        var curLength = this.ShapeSet.length;
        for (let i = 0; i < curLength; i++) {
            if (this.Productions.has(this.ShapeSet[i].symbol + "W")) {
                var successors = this.Productions.get(this.ShapeSet[i].symbol + "W").func(this.ShapeSet[i]);
                for (let j = 0; j < successors.length; j++) {
                    this.ShapeSet.push(successors[j]);
                }
                this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
            }
        }
        this.addRoof('roof3');
    }
}
// export class LSystem{
// 	ShapeSet: Array<string> = [];
// 	Axiom: string;
// 	Productions: Map<string, Rule>;
// 	Iterations: Array<string> = [];
// 	Current: string;
// 	constructor(){
// 		this.Productions = new Map();
// 	}
// 	loadProgramFromString(program: string){
// 		this.reset();
// 		this.Grammar = program;
// 		let index = 0;
// 		while(index < program.length){
// 			let nextIndex = program.indexOf("\n", index);
// 			let line = program.substr(index, nextIndex-index).trim();
// 			this.addProduction(line);
// 			if (nextIndex == -1) 
// 				break;
// 			index = nextIndex+1;
// 		}
// 	}
// 	setDefaultAngle(degrees: number){
// 		this.DefaultAngle = degrees;
// 	}
// 	setDefaultStep(distance: number){
// 		this.DefaultStep = distance;
// 	}
// 	//Iterate Grammar
// 	getIteration(n : number){
// 		if(n >= this.Iterations.length){
// 			for (let i = this.Iterations.length; i <= n; i++){
// 				this.Current = this.iterate(this.Current);
// 				this.Iterations.push(this.Current);
// 			}
// 		}
// 		return this.Iterations[n];
// 	}
// 	//Get Geometry from running the turtle
// 	process(n:number){
// 		let turtle = new Turtle();
// 		let stack = new Array();
// 		let insn = this.getIteration(n);
// 		//insn = "FF" + insn;
// 		//console.log(insn);
// 		turtle.applyLeftRot(-90);
// 		for(let i = 0; i < insn.length; i++){
// 			let sym = insn.substr(i, 1);
// 			if(sym == "F"){
// 				let start = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
// 				let p = Math.random();
// 				if (p > 0.2)
// 					turtle.moveForward(this.DefaultStep);
// 				else
// 					turtle.moveForward(this.DefaultStep * 1.2);
// 				let end = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
// 				this.Branches.push(new Branch(start, end, Math.max(controls.Thickness*Math.pow(controls.ShrinkExp,turtle.Depth), 0.05), Math.max(controls.Thickness*Math.pow(controls.ShrinkExp,turtle.Depth+1), 0.05)));
// 			}
// 			else if(sym == "f"){
// 				turtle.moveForward(this.DefaultStep);
// 			}
// 			else if(sym == "+"){
// 				turtle.applyUpRot(this.DefaultAngle);
// 			}
// 			else if(sym == "-"){
// 				turtle.applyUpRot(-this.DefaultAngle);
// 			}
// 			else if(sym == "&"){
// 				turtle.applyLeftRot(this.DefaultAngle);
// 			}
// 			else if(sym == "^"){
// 				turtle.applyLeftRot(-this.DefaultAngle);
// 			}
// 			else if(sym == "\\"){
// 				turtle.applyForwardRot(this.DefaultAngle);
// 			}
// 			else if(sym == "/"){
// 				turtle.applyForwardRot(-this.DefaultAngle);
// 			}
// 			else if(sym == "|"){
// 	            turtle.applyUpRot(180);
// 	        }
// 	        else if(sym == "["){
// 	        	let curTurtle = new Turtle();
// 	        	curTurtle.pos = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
// 	        	curTurtle.Up = vec3.fromValues(turtle.Up[0],turtle.Up[1],turtle.Up[2]);
// 	        	curTurtle.Forward = vec3.fromValues(turtle.Forward[0],turtle.Forward[1],turtle.Forward[2]);
// 	        	curTurtle.Left = vec3.fromValues(turtle.Left[0],turtle.Left[1],turtle.Left[2]);
// 	        	curTurtle.Depth = turtle.Depth;
// 	        	stack.push(curTurtle);
// 	        }
// 	        else if(sym == "]"){
// 	        	turtle = stack.pop();
// 	        }
// 	        else if(sym == "*"){
// 	        	let geoPos = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
// 	        	this.Geometries.push(new Geometry(geoPos, sym));
// 	        }
// 	        else{
// 				//let geoPos = vec3.fromValues(turtle.pos[0],turtle.pos[1],turtle.pos[2]);
// 	        	//this.Geometries.push(new Geometry(geoPos, sym));
// 	        }
// 		} 
// 	}
// 	reset(){
// 		this.Current = "";
// 		this.Branches = [];
// 		this.Iterations = [];
// 		this.Geometries = [];
// 		this.Productions.clear();
// 	}
// 	addProduction(line: string){
// 		let index;
// 		// Strip whitespace
// 		line.replace(" ", "");
// 		if (line.length == 0)
// 			return;
// 		// Split productions
// 		index = line.indexOf("->");
// 		if (index != -1){
// 			let symFrom = line.substr(0, index);
// 			let symTo = line.substr(index+2);
// 			this.Productions.set(symFrom, symTo);
// 		}
// 		else{
// 			this.Current = line;
// 		}
// 	}
// 	iterate(input: string){
// 		let output = "";
// 		for (let i = 0; i < input.length; i++){
// 			let sym = input.substr(i, 1);
// 			let next = "";
// 			if (this.Productions.has(sym)){
// 				next = this.Productions.get(sym);
// 			}
// 			else{
// 				next = sym;
// 			}
// 			output = output + next;
// 		}
// 		return output;
// 	}
// }
//# sourceMappingURL=LSystem.js.map