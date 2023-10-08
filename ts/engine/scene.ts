import { SceneBuilder } from "./builder.js";
import { Drawer } from "./drawer.js";
import { GameObject } from "./gameObject.js";

export class Scene
{
	public readonly root = document.createElement("div");
	private builder = new SceneBuilder(this);
	private drawer: Drawer | null = null;
	private rootObject: GameObject = new GameObject();

	public _engineEvent(event: "start" | "update" | "exit" | "langChange", t = 0)
	{
		if (event == "start")
		{
			this.Start(this.builder);
			this.builder._addStyles();
		}
		else if (event == "update")
		{
			if (!this.drawer) return;

			this.drawer._clear();
			this.rootObject._update(t);
			this.rootObject._draw(this.drawer);
		}
		else if (event == "exit")
		{
			this.Exit();
			this.builder._destroy();
			this.drawer?._destroy();
		}
		else if (event == "langChange")
		{
			this.builder._updateLang();
		}
	}

	public _initCanvas(canvas: HTMLCanvasElement)
	{
		this.drawer = new Drawer(canvas);
	}

	public _getRootObject()
	{
		return this.rootObject;
	}

	public Start(builder: SceneBuilder)
	{
		builder.canvas({ css: { height: "100dvh" } });
	}

	public Exit()
	{

	}

	public setViewSize(width: number, height: number)
	{
		this.drawer?._setViewSize(width, height);
	}

	public addObject<T extends GameObject>(object: T): T
	{
		return this.rootObject.addChild(object);
	}
}