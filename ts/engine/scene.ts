import { Builder } from "./builder.js";
import { Drawer } from "./drawer.js";
import { GameObject } from "./gameObject.js";

export class Scene
{
	public readonly root = document.createElement("div");
	private builder = new Builder(this);
	private drawer: Drawer | null = null;
	private canvasStarted = false;
	private rootObject: GameObject = new GameObject();

	public _engineEvent(event: "start" | "exit" | "langChange")
	{
		if (event == "start")
		{
			this.Start(this.builder);
			this.builder._addStyles();
		}
		else if (event == "exit")
		{
			this.Exit();
			this.builder._removeStyles();
			this.drawer?._destroy();
			this.canvasStarted = false;
		}
		else if (event == "langChange")
		{
			this.builder._updateLang();
		}
	}

	public _initCanvas(canvas: HTMLCanvasElement)
	{
		this.drawer = new Drawer(canvas);
		const alreadyStarted = this.canvasStarted;
		this.canvasStarted = true;
		if (!alreadyStarted)
			this.gameLoop(0);
	}

	private gameLoop(t: number)
	{
		const drawer = this.drawer;
		if (!drawer)
		{
			this.canvasStarted = false;
			return;
		}

		drawer._clear();
		this.rootObject._update(t);
		this.rootObject._draw(drawer);

		if (this.canvasStarted)
			requestAnimationFrame(this.gameLoop.bind(this));
	}

	public Start(builder: Builder)
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

	public addComponent(object: GameObject)
	{
		this.rootObject.addComponent(object);
	}
}