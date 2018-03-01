import {gl} from '../../globals';
import {vec3, vec4} from 'gl-matrix';

abstract class Mesh {
  indices: Array<number> = [];
  positions: Array<number> = [];
  normals: Array<number> = [];
  uvs: Array<number> = [];
  center: vec4;
  count: number = 0;

  abstract create() : void;
};

export default Mesh;
