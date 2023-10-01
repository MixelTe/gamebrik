import { Drawer } from "./drawer";
import { GameObjectModule } from "./gameObjectModule";

export class GameObject
{
	public transform = new Transform(this);
	public parent: GameObject | null = null;
	public children: GameObject[] = [];
	public modules: GameObjectModule[] = [];
	private started = false;

	public _update(t: number)
	{
		this.Update(t);
		this.children.forEach(obj => obj._update(t));
	}

	public _draw(drawer: Drawer)
	{
		drawer.save();
		drawer.applyObjectTransform(this.transform);
		drawer.save();
		this.Draw(drawer);
		drawer.restore();
		this.children.forEach(obj => obj._draw(drawer));
		drawer.restore();
	}

	public addChild<T extends GameObject>(object: T): T
	{
		this.children.push(object);
		if (!object.started)
			object.Start();
		return object;
	}

	public addModule<T extends typeof GameObjectModule, K extends InstanceType<T>>(moduleClass: T): K
	{
		const module = new moduleClass(this);
		this.modules.push(module);
		return module as K;
	}

	public Start()
	{

	}

	public Update(t: number)
	{

	}

	public Draw(drawer: Drawer)
	{

	}
}

export class Transform
{
	public x = 0;
	public y = 0;
	public w = 0;
	public h = 0;
	public ox = 0.5;
	public oy = 0.5;
	public r = 0;
	public sx = 1;
	public sy = 1;

	constructor(private object: GameObject) { }

	public get global(): Transform
	{
		const t = new Transform(this.object);



		return t;
	}

}