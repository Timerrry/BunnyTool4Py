import { cloneDeep, unset, isEqual } from 'lodash';
import Q from 'q';
import path from 'path';
import { rejectError } from './util';

export const PROJECT_EXT = "bc";

export function saveProject(savePath, project, options = "all") {
	let actions = [];

	if(project.type === "graph") {
		if(options === "all") {
			let dumpProject = cloneDeep(project);
			unset(dumpProject, "path");
			unset(dumpProject, "key");
			actions.push(bridge.postMessage("fs.writeJson", path.join(savePath, `project.${PROJECT_EXT}`), dumpProject));
		}
		if(options === "all" || options === "code") {
			actions.push(bridge.postMessage("fs.write", path.join(savePath, "main.ino"), project.blockly.code));
		}
	} else {
		if(options === "all" || options === "project") {
			let dumpProject = cloneDeep(project);
			unset(dumpProject, "path");
			unset(dumpProject, "key");
			actions.push(bridge.postMessage("fs.writeJson", path.join(savePath, `project.${PROJECT_EXT}`), dumpProject));
		}

		if(options === "all" || options === "code") {
			actions = actions.concat(project.files.map(file => bridge.postMessage("fs.write", path.join(savePath, file.name), file.content)));
		}
	}

	return Q.all(actions);
}

export function readProject(projectPath, temp = false) {
	let deferred =  Q.defer();

	let suffix = `project.${PROJECT_EXT}`;
	projectPath = projectPath.endsWith(suffix) ? projectPath : path.join(projectPath, suffix);
	projectPath = projectPath.replace(/\\/g, "/");
	let dirname = temp ? "" : path.dirname(projectPath);
	bridge.postMessage("fs.readJson", projectPath)
	.then(project => deferred.resolve({...project, path: dirname}))
	.catch(err => rejectError(err, deferred));

	return deferred.promise;
}

export function isProjectChange(oldProject, newProject) {
	if(!oldProject || !newProject) {
		return true;
	}

	if(!isEqual(oldProject.name, newProject.name) || !isEqual(oldProject.author, newProject.author) || !isEqual(oldProject.board, newProject.board)) {
		return true;
	}

	if(newProject.type === "graph") {
		if(!isEqual(oldProject.components, newProject.components)) {
			return true;
		}

		if(!isEqual(oldProject.blockly, newProject.blockly)) {
			return true;
		}
	} else {
		if(!isEqual(oldProject.files, newProject.files)) {
			return true;
		}
	}

	return false;
}
