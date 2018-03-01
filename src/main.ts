import {vec2, vec3, mat4, quat} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Cylinder from './geometry/Cylinder';
import Plane from './geometry/Plane';
import ObjLoad from './geometry/ObjLoad';
import Scene from './rendering/gl/Scene';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {Building1, Building2, Building3, Building4, Building5} from './LSystem';
import Mesh from './rendering/gl/Mesh';
import {Turtle} from './Turtle';
import {Perlin} from './perlin';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
export const controls = {
  TerrainSeed: 24860,
  BaseColor: [222,222,222, 1],
  ShowDensity: false,
  ShowTexture: true,
  Iterations: 20,
  'Load Scene': loadScene, // A function pointer, essentially 
};


//let LS: LSystem;
var terrainDens: Array<number> = [];
var ground: Scene;
var buildings: Array<Scene> = [];
var MeshDict: Map<string, Mesh>;
//OBJ loading
// var fs = require('fs');
// var OBJ = require('webgl-obj-loader');

// var meshPath = '../mesh/lotus_OBJ_low.obj';
// var opt = {encoding: 'utf8'};

function computeWorldM(trans:vec3, scale:vec3, rot:vec3){
  let worldM = mat4.create();
  let worldScale = mat4.create();
  let worldRot   = mat4.create();
  let worldTrans = mat4.create();
  let rotQuat = quat.create();
  quat.fromEuler(rotQuat, rot[0], rot[1], rot[2]);
  mat4.scale(worldScale, worldScale, scale);
  mat4.fromQuat(worldRot, rotQuat);
  mat4.translate(worldTrans, worldTrans, trans);
  mat4.multiply(worldM, worldScale, worldM);
  mat4.multiply(worldM, worldRot, worldM);
  mat4.multiply(worldM, worldTrans, worldM);
  return worldM;
}

function loadScene() {
  terrainDens = [];
  //Terrain Generation
  let Perl = new Perlin(controls.TerrainSeed/65535);

  for (var x = 0; x < 1024; x++) {
    for (var y = 0; y < 1024; y++) {
      var value = Math.abs(Perl.perlin2(x / 200, y / 200));
      value*=value;
      value*=5;
      terrainDens.push(value);
     }
   }

  buildings = [];
  ground = new Scene();
  let groundDim = 100;
  //Plane
  let plane = new Plane(vec3.fromValues(0,0,0), groundDim);
  plane.create();
  ground.add(plane, mat4.create(), 0.0);
  ground.createBuffer();
  ground.bindTex("./src/models/grass.jpg");

  let window = MeshDict.get('window');

  console.log(terrainDens);
  // Building 1 ~ 5
  buildings.push(new Scene());
  buildings.push(new Scene());
  buildings.push(new Scene());
  buildings.push(new Scene());
  buildings.push(new Scene());
  for(let i = 0; i < 20; i++){
    for(let j = 0; j < 20; j++){
      let curCenter = vec3.fromValues((-groundDim/2.0+2.5)+5*i, 0, (-groundDim/2.0+2.5)+5*j);
      let curDens = terrainDens[Math.floor(2.5/groundDim*1024)*i*1024 + Math.floor(2.5/groundDim*1024)*j];
      if(curDens>0.05){
        let rand = Math.random();
        if(curDens > 1.4){
          let worldM = computeWorldM(curCenter, vec3.fromValues(1+rand*0.3, 1, 1+rand*0.3), vec3.fromValues(0,0,0));
          Turtle(buildings[4], new Building5(vec3.create()), worldM, Math.floor(controls.Iterations*curDens), 
            MeshDict.get('base5'), MeshDict.get('mid5'), MeshDict.get('mid5'),MeshDict.get('roof5'), window,
            curDens);
        }
        else if(curDens > 0.5){
          let worldM = computeWorldM(curCenter, vec3.fromValues(1+rand*0.3, 1, 1+rand*0.3), vec3.fromValues(0,0,0));
          Turtle(buildings[0], new Building1(vec3.create()), worldM, Math.floor(controls.Iterations*curDens), 
            MeshDict.get('base1'), MeshDict.get('mid1'), MeshDict.get('mid1'), MeshDict.get('roof1'), window,
            curDens);
        }
        else if(curDens > 0.2){
          let worldM = computeWorldM(curCenter, vec3.fromValues(1+rand*0.3, 1, 1+rand*0.3), vec3.fromValues(0,90,0));
          Turtle(buildings[2], new Building3(vec3.create()), worldM, Math.floor(controls.Iterations*curDens), 
            MeshDict.get('base3'), MeshDict.get('mid3'), MeshDict.get('mid3_2'), MeshDict.get('roof3'), window,
            curDens);
        }
        else if(curDens > 0.1){
         let rand2 = Math.random();
          if (rand2 < 0.2){
            let worldM = computeWorldM(curCenter, vec3.fromValues(1+rand*0.3, 1, 1+rand*0.3), vec3.fromValues(0,0,0));
            Turtle(buildings[1], new Building2(vec3.create()), worldM, Math.floor(controls.Iterations*curDens), 
              MeshDict.get('base2'), MeshDict.get('mid2'), MeshDict.get('mid2'),MeshDict.get('roof2'), window,
              curDens);
          }
          else{
            let worldM = computeWorldM(curCenter, vec3.fromValues(1+rand*0.3, 1, 1+rand*0.3), vec3.fromValues(0,90,0));
            Turtle(buildings[2], new Building3(vec3.create()), worldM, Math.floor(controls.Iterations*curDens), 
              MeshDict.get('base3'), MeshDict.get('mid3'), MeshDict.get('mid3_2'), MeshDict.get('roof3'), window,
              curDens);
          }
        }
        else{
          let worldM = computeWorldM(curCenter, vec3.fromValues(2+rand*0.3, 1.6, 2+rand*0.3), vec3.fromValues(0,0,0));
          Turtle(buildings[3], new Building4(vec3.create()), worldM, Math.floor(controls.Iterations*curDens), 
            MeshDict.get('base4'), MeshDict.get('mid4'), MeshDict.get('mid4'), MeshDict.get('roof4'), window,
            curDens);          
        }
      }
    }
  }

  buildings[0].createBuffer();
  buildings[1].createBuffer();
  buildings[2].createBuffer();
  buildings[3].createBuffer();
  buildings[4].createBuffer();
  buildings[0].bindTex("./src/models/building1.png");
  buildings[1].bindTex("./src/models/building2.png");
  buildings[2].bindTex("./src/models/building3.png");
  buildings[3].bindTex("./src/models/building4.png");
  buildings[4].bindTex("./src/models/building5.png");
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'TerrainSeed', 0, 65535).step(1);
  gui.addColor(controls, 'BaseColor');
  gui.add(controls, 'ShowDensity');
  gui.add(controls, 'ShowTexture');
  gui.add(controls, 'Iterations', 1.0, 50.0).step(1.0);
  gui.add(controls, 'Load Scene');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);
  gl.enable(gl.CULL_FACE);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(40, 40, 40), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.0,0.0,0.0, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.cullFace(gl.BACK);
  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/ground-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/ground-frag.glsl')),
  ]);

  const branch_shader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/building-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/building-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, lambert, [
      ground
    ]);
    renderer.render(camera, branch_shader, buildings);
    stats.end();
    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop
  tick();
}

function readTextFile(file : string) : string
{
   console.log("Download" + file + "...");
    var rawFile = new XMLHttpRequest();
    let resultText : string;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                resultText= rawFile.responseText;                
            }
        }
    }
    rawFile.send(null);

    return resultText;
}

function DownloadMeshes()
{
  MeshDict = new Map();
  // Window
  let obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/window.obj"));
  MeshDict.set('window', obj);
  // Building1
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/base1.obj"));
  MeshDict.set('base1', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/mid1.obj"));
  MeshDict.set('mid1', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/roof1.obj"));
  MeshDict.set('roof1', obj);
  // Building2
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/base2.obj"));
  MeshDict.set('base2', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/mid2.obj"));
  MeshDict.set('mid2', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/roof2.obj"));
  MeshDict.set('roof2', obj);
  // Building3
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/base3.obj"));
  MeshDict.set('base3', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/mid3.obj"));
  MeshDict.set('mid3', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/mid3_2.obj"));
  MeshDict.set('mid3_2', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/roof3.obj"));
  MeshDict.set('roof3', obj);
  // Building4
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/base4.obj"));
  MeshDict.set('base4', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/mid4.obj"));
  MeshDict.set('mid4', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/roof4.obj"));
  MeshDict.set('roof4', obj);
  // Building5
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/base5.obj"));
  MeshDict.set('base5', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/mid5.obj"));
  MeshDict.set('mid5', obj);
  obj = new ObjLoad(vec3.fromValues(0,0,0));
  obj.createdByLoader(readTextFile("./src/models/roof5.obj"));
  MeshDict.set('roof5', obj);

  console.log("Downloading is complete!");

  main();  
}

DownloadMeshes();