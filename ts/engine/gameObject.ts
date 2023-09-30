import { Drawer } from "./drawer";

export class GameObject
{
	public transform = new Transform();
	protected children: GameObject[] = [];
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

	public addComponent(object: GameObject)
	{
		this.children.push(object);
		if (!object.started)
			object.Start();
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
}