import { Styles } from "./styles.js";
import { Inspector } from "./inspector.js";
import { Scene } from "./scene.js";

class Engine
{
	private scenes = new Map<string, typeof Scene>();
	private inspector = new Inspector();
	private currentScene: Scene | null = null;
	private lang: Language = "ru";
	private gameLoopStarted = false;

	public get language(): Language
	{
		return this.lang;
	}

	constructor()
	{
		const styles = Styles.createStyles([
			new Styles({ normal: { margin: 0, minWidth: 320 } }, "body"),
			new Styles({ normal: { height: "100dvh" } }, "scene"),
		]);
		document.head.appendChild(styles);
		document.body.classList.add("body");
		window.addEventListener("contextmenu", e => e.preventDefault());
	}

	private gameLoop(t: number)
	{
		this.currentScene?._engineEvent("update", t);
		this.inspector.update();
		requestAnimationFrame(this.gameLoop.bind(this));
	}

	public registerScenes(scenes: { [id: string]: typeof Scene })
	{
		for (const id in scenes)
		{
			this.scenes.set(id, scenes[id]);
		}
	}

	public startScene(id: string)
	{
		const scene = this.scenes.get(id);

		if (scene == undefined)
			throw new Error(`Engine.startScene: no scene with id: ${id}`);

		if (this.currentScene)
			this.currentScene._engineEvent("exit");

		this.currentScene = new scene();
		this.currentScene._engineEvent("start");

		document.body.innerHTML = "";
		document.body.appendChild(this.currentScene.root);
		this.currentScene.root.classList.add("scene");

		localStorage.setItem(localstorageKey_scene, id);
		this.inspector.setRoot(this.currentScene._getRootObject());

		if (!this.gameLoopStarted)
		{
			this.gameLoopStarted = true;
			this.gameLoop(0);
		}
	}

	public startSameSceneAfterReload(defaultSceneId: string)
	{
		const id = localStorage.getItem(localstorageKey_scene) || defaultSceneId;
		this.startScene(id);
	}

	public showInspector()
	{
		this.inspector.show();
		if (this.currentScene)
			this.inspector.setRoot(this.currentScene._getRootObject());
	}

	public changeLang()
	{
		if (this.lang == "ru") this.lang = "en";
		else this.lang = "ru";
		this.currentScene?._engineEvent("langChange");
	}
}

export type Language = "ru" | "en";

const localstorageKey_scene = "Engine_currentScene";

export const engine = new Engine();
