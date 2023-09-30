import { Styles } from "./builder.js";
import { Scene } from "./scene.js";

class Engine
{
	private scenes = new Map<string, typeof Scene>();
	private currentScene: Scene | null = null;
	private lang: Language = "ru";

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
	}

	public startSameSceneAfterReload(defaultSceneId: string)
	{
		const id = localStorage.getItem(localstorageKey_scene) || defaultSceneId;
		this.startScene(id);
	}

	public localize<T extends Record<string, Record<Language, any>>, K extends { [key in keyof T]: () => T[key][Language] }>(fields: T): K
	{
		const r: { [key: string]: any } = {};
		Object.keys(fields).forEach(key =>
		{
			r[key] = () => fields[key][this.lang];
		})

		return <K>r;
	}

	public changeLang()
	{
		if (this.lang == "ru") this.lang = "en";
		else this.lang = "ru";
		this.currentScene?._engineEvent("langChange");
	}
}

type Language = "ru" | "en";

const localstorageKey_scene = "Engine_currentScene";

export const engine = new Engine();
