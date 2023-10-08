import { Engine } from "../engine/index.js";
import SceneIds, { Scenes } from "./scenes.js";

Engine.registerScenes(Scenes);
// Engine.startScene(SceneIds.start);
Engine.startSameSceneAfterReload(SceneIds.start);
Engine.showInspector();
