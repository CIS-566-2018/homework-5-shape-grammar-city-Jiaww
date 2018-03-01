import {vec3, vec4, mat4} from 'gl-matrix';
import {Turtle} from './Turtle';
import {controls} from './main'

class Rule{
	constructor(public probility:number, public func:Function){
		this.probility = probility;
		this.func = func;
	}
}

class Shape{
	constructor(public predecessor: Shape, public symbol:string, public geometry:string, 
		public pos:vec3, public rot:vec3, 
		public scale:vec3, public xaxis:vec3, public zaxis:vec3){
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

export abstract class Building{
	ShapeSet: Array<Shape> = [];
	Center: vec3;
	BaseHeight: number;
	TopHeight: number;
	Productions: Map<string, Rule>;
	Root: Shape;
	Iterations: Array<string> = [];

	constructor(){}
    abstract process(n: number) : void;
    addBase(objName: string){
		this.ShapeSet.push(new Shape(this.Root, 'B', objName,
						vec3.fromValues(0,0,0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
		this.TopHeight += 1;
		this.BaseHeight = 1;
	}
	addRoof(objName: string){
		this.ShapeSet.push(new Shape(this.Root, 'R', objName,
						vec3.fromValues(0,this.TopHeight,0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
	}
}

// Repeat
function f1(predecessor: Shape, angle: number){
	let rand = Math.random();
	if(rand<0.8){
		let newXaxis = vec3.create();
		let newZaxis = vec3.create();
		let rotAngle = angle;
		vec3.rotateY(newXaxis, predecessor.xaxis, [0,0,0], rotAngle/180*Math.PI);
		vec3.rotateY(newZaxis, predecessor.zaxis, [0,0,0], rotAngle/180*Math.PI);
		vec3.normalize(newXaxis, newXaxis);
		vec3.normalize(newZaxis, newZaxis);
		let successor = new Shape(predecessor, predecessor.symbol, predecessor.geometry, 
			vec3.fromValues(predecessor.pos[0], predecessor.pos[1]+1, predecessor.pos[2]),
			vec3.fromValues(predecessor.rot[0], predecessor.rot[1]+rotAngle, predecessor.rot[2]),
			predecessor.scale,
			newXaxis,
			newZaxis);
		return successor;	
	}
	else{
		let newXaxis = predecessor.xaxis;
		let newZaxis = predecessor.zaxis;
		let successor = new Shape(predecessor, predecessor.symbol, predecessor.geometry, 
			vec3.fromValues(predecessor.pos[0], predecessor.pos[1]+1, predecessor.pos[2]),
			vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]),
			predecessor.scale,
			newXaxis,
			newZaxis);
		return successor;	
	}
}

// Add Windows(building 1)
function f2(predecessor: Shape){
	let rand = Math.random();
	let successors = Array<Shape>();
	if (rand < 0.6){
		// 8 Windows(4 each side)
		let oriPos = predecessor.pos;
		let newPos = vec3.create();
		for (let i = 0; i < 4; i++){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*1.0);
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0]*(0.6 - 0.4*i));		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.25, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.15, predecessor.scale[1]*0.5, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
		// Back Side
		for (let i = 0; i < 4; i++){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*-1.0);
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0]*(0.6 - 0.4*i));		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.25, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.15, predecessor.scale[1]*0.5, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	else{
		// 6 Windiws(3 each side)
		let oriPos = predecessor.pos;
		let newPos = vec3.create();
		for (let i = 0; i < 3; i++){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*1.0);
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0]*(0.5 - 0.5*i));		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.25, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.15, predecessor.scale[1]*0.5, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
		// Back Side
		for (let i = 0; i < 3; i++){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*-1.0);
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0]*(0.5 - 0.5*i));		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.25, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.15, predecessor.scale[1]*0.5, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	return successors;
}

export class Building1 extends Building{
	constructor(center:vec3){
		super();
		this.Center = center;
		this.BaseHeight = 1.0;
		this.TopHeight = 0.0;
		this.Root = new Shape(null, 'Root', 'root',
						this.Center, 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1));
		this.Productions = new Map();
		this.Productions.set('M', new Rule(1.0, f1));
		//Windows
		this.Productions.set('MEW', new Rule(1.0, f2));
		this.Productions.set('MW', new Rule(1.0, f2));
	}
	process(n: number){
		this.addBase('base');
		for (let i = 0; i < n; i++){
			if (i == 0){
				this.ShapeSet.push(new Shape(this.Root, 'M', 'mid',
						vec3.fromValues(0,this.BaseHeight,0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
				this.TopHeight += 1;
			}
			else{
				var curLength = this.ShapeSet.length;
				for (let j = 0; j < curLength; j++){
					if(this.Productions.has(this.ShapeSet[j].symbol)){
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
		for (let i = 0; i < curLength; i++){
			if(this.Productions.has(this.ShapeSet[i].symbol+"W")){
				var successors = this.Productions.get(this.ShapeSet[i].symbol+"W").func(this.ShapeSet[i]);
				for(let j = 0; j < successors.length; j++){
					this.ShapeSet.push(successors[j]);
				}
				this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
			}
		}
		this.addRoof('roof');
	}

	// reset(){
	// 	this.Current = "";
	// 	this.Branches = [];
	// 	this.Iterations = [];
	// 	this.Geometries = [];
	// 	this.Productions.clear();
	// }
}

// Add windows building 2
function f3(predecessor: Shape){
	let rand = Math.random();
	let successors = Array<Shape>();
	if (rand < 1.0){
		// (1 Windows each side)
		let oriPos = predecessor.pos;
		let newPos = vec3.create();
		for (let i = 0; i < 10; i++){
			let theta = (2*Math.PI)/10*i - Math.PI/4;
			let curZaxis = vec3.create();
			let curXaxis = vec3.create();
			vec3.rotateY(curZaxis, predecessor.zaxis, vec3.fromValues(0,0,0), theta);
			vec3.rotateY(curXaxis, predecessor.xaxis, vec3.fromValues(0,0,0), theta);
			vec3.scaleAndAdd(newPos, oriPos, curZaxis, predecessor.scale[2] * 1.32);
			vec3.scaleAndAdd(newPos, newPos, curXaxis, predecessor.scale[0] * 1.32);		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.25, newPos[2]),
				vec3.fromValues(predecessor.rot[0], predecessor.rot[1]+(theta/Math.PI*180 - 45), predecessor.rot[2]),
				vec3.fromValues(predecessor.scale[0]*0.15, predecessor.scale[1]*0.5, predecessor.scale[2]*0.2),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	return successors;
}

export class Building2 extends Building{
	constructor(center:vec3){
		super();
		this.Center = center;
		this.BaseHeight = 1.0;
		this.TopHeight = 0.0;
		this.Root = new Shape(null, 'Root', 'root',
						this.Center, 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1));
		this.Productions = new Map();
		this.Productions.set('M', new Rule(1.0, f1));
		//Windows
		this.Productions.set('MEW', new Rule(1.0, f3));
		this.Productions.set('MW', new Rule(1.0, f3));
	}
	process(n: number){
		this.addBase('base');
		for (let i = 0; i < n; i++){
			if (i == 0){
				this.ShapeSet.push(new Shape(this.Root, 'M', 'mid',
						vec3.fromValues(0,this.BaseHeight,0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
				this.TopHeight += 1;
			}
			else{
				var curLength = this.ShapeSet.length;
				for (let j = 0; j < curLength; j++){
					if(this.Productions.has(this.ShapeSet[j].symbol)){
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
		for (let i = 0; i < curLength; i++){
			if(this.Productions.has(this.ShapeSet[i].symbol+"W")){
				var successors = this.Productions.get(this.ShapeSet[i].symbol+"W").func(this.ShapeSet[i]);
				for(let j = 0; j < successors.length; j++){
					this.ShapeSet.push(successors[j]);
				}
				this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
			}
		}
		this.addRoof('roof');
	}
}

// Building 3
function f4(predecessor: Shape){
	let newXaxis = predecessor.xaxis;
	let newZaxis = predecessor.zaxis;
	let offset = predecessor.pos[2]+1.0;
	if (offset > 1.0)
		offset = -1.0;
	let geo;
	if (predecessor.geometry == 'mid')
		geo = 'mid_2';
	else
		geo = 'mid';
	let successor = new Shape(predecessor, predecessor.symbol, geo, 
		vec3.fromValues(predecessor.pos[0], predecessor.pos[1]+1, offset),
		vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]),
		predecessor.scale,
		newXaxis,
		newZaxis);
	return successor;	
}

function f5(predecessor: Shape){
	let successors = Array<Shape>();
	// 8 Windows(4 each side)
	let oriPos = predecessor.pos;
	let newPos = vec3.create();
	// Front Side
	for (let i = 0; i < 3; i++){
		let rand = Math.random();
		if(rand < 0.75){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*(-0.25 + 0.25*i));
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0]*1.5);		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.6, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.05, predecessor.scale[1]*0.2, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	for (let i = 0; i < 3; i++){
		let rand = Math.random();
		if(rand < 0.75){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*(-0.25 + 0.25*i));
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, predecessor.scale[0]*1.5);		
			successors.push(new Shape(predecessor, "W", 'base', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.3, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.05, predecessor.scale[1]*0.2, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	// Back Side
	for (let i = 0; i < 3; i++){
		let rand = Math.random();
		if(rand < 0.75){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*(-0.25 + 0.25*i));
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, -predecessor.scale[0]*1.5);		
			successors.push(new Shape(predecessor, "W", 'window', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.6, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.05, predecessor.scale[1]*0.2, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	for (let i = 0; i < 3; i++){
		let rand = Math.random();
		if(rand < 0.75){
			vec3.scaleAndAdd(newPos, oriPos, predecessor.zaxis, predecessor.scale[2]*(-0.25 + 0.25*i));
			vec3.scaleAndAdd(newPos, newPos, predecessor.xaxis, -predecessor.scale[0]*1.5);		
			successors.push(new Shape(predecessor, "W", 'base', 
				vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.3, newPos[2]),
				predecessor.rot,
				vec3.fromValues(predecessor.scale[0]*0.05, predecessor.scale[1]*0.2, predecessor.scale[2]*0.1),
				predecessor.xaxis,
				predecessor.zaxis));
		}
	}
	return successors;
}

export class Building3 extends Building{
	constructor(center:vec3){
		super();
		this.Center = center;
		this.BaseHeight = 1.0;
		this.TopHeight = 0.0;
		this.Root = new Shape(null, 'Root', 'root',
						this.Center, 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1));
		this.Productions = new Map();
		this.Productions.set('M', new Rule(1.0, f4));
		//Windows
		this.Productions.set('MEW', new Rule(1.0, f5));
		this.Productions.set('MW', new Rule(1.0, f5));
	}
	process(n: number){
		this.addBase('base');
		this.BaseHeight = 0.08;
		this.TopHeight = 0.08;
		for (let i = 0; i < n; i++){
			if (i == 0){
				this.ShapeSet.push(new Shape(this.Root, 'M', 'mid',
						vec3.fromValues(-0.25,this.BaseHeight,1.0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
				this.ShapeSet.push(new Shape(this.Root, 'M', 'mid_2',
						vec3.fromValues(0,this.BaseHeight,0.0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
				this.ShapeSet.push(new Shape(this.Root, 'M', 'mid',
						vec3.fromValues(0.25,this.BaseHeight,-1.0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
				this.TopHeight += 1;
			}
			else{
				var curLength = this.ShapeSet.length;
				for (let j = 0; j < curLength; j++){
					if(this.Productions.has(this.ShapeSet[j].symbol)){
						var successor = this.Productions.get(this.ShapeSet[j].symbol).func(this.ShapeSet[j], 0);
						this.ShapeSet[j].symbol = this.ShapeSet[j].symbol + 'E';
						this.ShapeSet.push(successor);
						this.TopHeight += 1/3;
					}
				}
			}
		}
		// Add Windows
		var curLength = this.ShapeSet.length;
		for (let i = 0; i < curLength; i++){
			if(this.Productions.has(this.ShapeSet[i].symbol+"W")){
				var successors = this.Productions.get(this.ShapeSet[i].symbol+"W").func(this.ShapeSet[i]);
				for(let j = 0; j < successors.length; j++){
					this.ShapeSet.push(successors[j]);
				}
				this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
			}
		}
		this.addRoof('roof');
	}
}

// Building 4
// Small house
function f6(predecessor: Shape, flags: Array<number>){
	if (predecessor.symbol !== 'B')
		return [null, flags];
	let newXaxis = predecessor.xaxis;
	let newZaxis = predecessor.zaxis;
	let rand = Math.random();
	let successor = null;
	let newScale = vec3.fromValues(predecessor.scale[0],predecessor.scale[1],predecessor.scale[2]);
	newScale[1] = newScale[1] * (0.6 + 0.25*Math.random());
	if (rand < 0.33 && flags[0] == 1){
		newScale[0] = newScale[0] * (0.6 + 0.6 * Math.random());
		newScale[2] = newScale[2] * (0.6 + 0.25 * Math.random());
		successor = new Shape(predecessor, "MB", predecessor.geometry, 
		vec3.fromValues(predecessor.pos[0]+(predecessor.scale[0]+newScale[0])/2, predecessor.pos[1], predecessor.pos[2]),
		vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]),
		newScale,
		newXaxis,
		newZaxis);
		flags[0] = 0;
	}
	else if (rand <0.66 && flags[1] == 1){
		newScale[0] = newScale[0] * (0.6 + 0.6 * Math.random());
		newScale[2] = newScale[2] * (0.6 + 0.25 * Math.random());
		successor = new Shape(predecessor, "MB", predecessor.geometry, 
		vec3.fromValues(predecessor.pos[0]-(predecessor.scale[0]+newScale[0])/2, predecessor.pos[1], predecessor.pos[2]),
		vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]),
		newScale,
		newXaxis,
		newZaxis);
		flags[1] = 0;
	}
	else if (flags[2] == 1){
		newScale[0] = newScale[0] * (0.6 + 0.25 * Math.random());
		newScale[2] = newScale[2] * (0.6 + 0.6 * Math.random());
		successor = new Shape(predecessor, "MB", predecessor.geometry, 
		vec3.fromValues(predecessor.pos[0], predecessor.pos[1], predecessor.pos[2]-(predecessor.scale[2]+newScale[2])/2),
		vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]),
		newScale,
		newXaxis,
		newZaxis);
		flags[2] = 0;
	}
	return [successor, flags];	
}

function f7(predecessor: Shape){
	let newXaxis = predecessor.xaxis;
	let newZaxis = predecessor.zaxis;
	let successor = null;
	successor = new Shape(predecessor, "R", 'roof', 
	vec3.fromValues(predecessor.pos[0], predecessor.pos[1]+predecessor.scale[1], predecessor.pos[2]),
	vec3.fromValues(predecessor.rot[0], predecessor.rot[1], predecessor.rot[2]),
	predecessor.scale,
	newXaxis,
	newZaxis);
	return successor;
}

export class Building4 extends Building{
	constructor(center:vec3){
		super();
		this.Center = center;
		this.BaseHeight = 1.0;
		this.TopHeight = 0.0;
		this.Root = new Shape(null, 'Root', 'root',
						this.Center, 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1));
		this.Productions = new Map();
		this.Productions.set('B', new Rule(1.0, f6));
		this.Productions.set('BR', new Rule(1.0, f7));
		this.Productions.set('MBR', new Rule(1.0, f7));
		//Windows
		this.Productions.set('MEW', new Rule(1.0, f5));
		this.Productions.set('MW', new Rule(1.0, f5));
	}
	process(n: number){
		let num = Math.min(n, 4);
		var flags = new Array<number>();
		flags.push(1,1,1);
		this.addBase('base');
		for (let i = 0; i < num; i++){
			var successor;
			[successor, flags] = this.Productions.get(this.ShapeSet[0].symbol).func(this.ShapeSet[0], flags);
			if(successor !== null)
				this.ShapeSet.push(successor);
		}
		//Add Roof
		var curLength = this.ShapeSet.length;
		for (let i = 0; i < curLength; i++){
			if(this.Productions.has(this.ShapeSet[i].symbol+'R')){
				var successor = this.Productions.get(this.ShapeSet[i].symbol+'R').func(this.ShapeSet[i]);
				this.ShapeSet.push(successor);
			}
		}
	}
}

function f8(predecessor: Shape){
	let rand = Math.random();
	let theta = Math.PI*2*rand;
	let curZaxis = vec3.create();
	let curXaxis = vec3.create();
	let oriPos = predecessor.pos;
	let newPos = vec3.create();
	vec3.rotateY(curZaxis, predecessor.zaxis, vec3.fromValues(0,0,0), theta);
	vec3.rotateY(curXaxis, predecessor.xaxis, vec3.fromValues(0,0,0), theta);
	vec3.scaleAndAdd(newPos, oriPos, curZaxis, predecessor.scale[2] * 0.3);
	vec3.scaleAndAdd(newPos, newPos, curXaxis, predecessor.scale[0] * 0.3);		
	let successor = new Shape(predecessor, "W", 'window', 
		vec3.fromValues(newPos[0], newPos[1]+predecessor.scale[1]*0.25, newPos[2]),
		vec3.fromValues(predecessor.rot[0], predecessor.rot[1]+(theta/Math.PI*180 - 45), predecessor.rot[2]),
		vec3.fromValues(predecessor.scale[0]*0.1, predecessor.scale[1]*0.4, predecessor.scale[2]*0.12),
		predecessor.xaxis,
		predecessor.zaxis);
	return successor;
}

// Building 5
// Tower
export class Building5 extends Building{
	constructor(center:vec3){
		super();
		this.Center = center;
		this.BaseHeight = 1.0;
		this.TopHeight = 0.0;
		this.Root = new Shape(null, 'Root', 'root',
						this.Center, 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1));
		this.Productions = new Map();
		this.Productions.set('M', new Rule(1.0, f1));
		//Windows
		this.Productions.set('MEW', new Rule(1.0, f8));
		this.Productions.set('MW', new Rule(1.0, f8));
	}
	process(n: number){
		this.addBase('base');
		for (let i = 0; i < n; i++){
			if (i == 0){
				this.ShapeSet.push(new Shape(this.Root, 'M', 'mid',
						vec3.fromValues(0,this.BaseHeight,0), 
						vec3.fromValues(0,0,0), 
						vec3.fromValues(1,1,1), 
						vec3.fromValues(1,0,0), 
						vec3.fromValues(0,0,1)));
				this.TopHeight += 1;
			}
			else{
				var curLength = this.ShapeSet.length;
				for (let j = 0; j < curLength; j++){
					if(this.Productions.has(this.ShapeSet[j].symbol)){
						var successor = this.Productions.get(this.ShapeSet[j].symbol).func(this.ShapeSet[j], 0.0);
						this.ShapeSet[j].symbol = this.ShapeSet[j].symbol + 'E';
						this.ShapeSet.push(successor);
						this.TopHeight += 1;
					}
				}
			}
		}
		// Add Windows
		var curLength = this.ShapeSet.length;
		for (let i = 0; i < curLength; i++){
			if(this.Productions.has(this.ShapeSet[i].symbol+"W")){
				successor = this.Productions.get(this.ShapeSet[i].symbol+"W").func(this.ShapeSet[i]);
				this.ShapeSet.push(successor);

				this.ShapeSet[i].symbol = this.ShapeSet[i].symbol + 'E';
			}
		}
		this.addRoof('roof');
	}
}