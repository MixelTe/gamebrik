import { Engine } from "../engine/index.js";
import { SceneStart } from "./scenes/start.js";

Engine.registerScenes({
	start: SceneStart,
})

Engine.startScene("start");
