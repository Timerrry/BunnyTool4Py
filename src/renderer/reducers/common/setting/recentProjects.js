import { stamp } from "../../../lib/util";
import { uniqBy } from 'lodash';

const ADD = 'setting/recent-projects/add';
const PRUNE = 'setting/recent-projects/prune';
const LOAD = 'setting/recent-projects/load';

const maxCount = 5;
const initState = [];

export default (state = initState, action) => {
  switch (action.type) {
    case ADD:
      let projects = uniqBy([action.project, ...state], p => p.path.replace(/\\/g, "/"));
      return projects.length > maxCount ? projects.slice(0, -1) : projects;
    case PRUNE:
      let projectPath = action.projectPath.replace(/\\/g, "/");
      return state.filter(p => p.path !== projectPath);
    case LOAD:
      return uniqBy(action.projects, p => p.path);
    default:
      return state;
  }
};

export function add({ name, path, type, ...rest }) {
  return {
    type: ADD,
    project: {name, path, type, ...rest, lastOpenAt: stamp()}
  };
}

export function load(projects) {
  return {
    type: LOAD,
    projects,
  };
}

export function prune(projectPath) {
  return {
    type: PRUNE,
    projectPath,
  };
}
