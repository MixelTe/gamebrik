import { SceneLines } from "./scenes/lines.js"
import { SceneStart } from "./scenes/start.js"

export const Scenes = {
	start: SceneStart,
	lines: SceneLines,
}

const SceneIds = getScenesIds(Scenes);
export default SceneIds;


function getScenesIds<T extends Record<string, any>, K extends { [key in keyof T]: string }>(scenes: T): K
{
	const r: { [key: string]: string } = {};
	Object.keys(scenes).forEach(key =>
	{
		r[key] = key;
	})

	return <K>r;
}