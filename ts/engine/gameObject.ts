import { Drawer } from "./drawer.js";
import { GameObjectModule } from "./gameObjectModule.js";
import { Utils } from "./utils.js";

export class GameObject
{
	public transform = new Transform(this);
	public parent: GameObject | null = null;
	public children: GameObject[] = [];
	public modules: GameObjectModule[] = [];
	public drawDev = false;
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
		this.modules.forEach(obj => obj.onDraw(drawer));
		drawer.restore();
		this.children.forEach(obj => obj._draw(drawer));
		if (this.drawDev) this.drawTransform(drawer);
		drawer.restore();
	}

	private drawTransform(drawer: Drawer)
	{
		drawer.fillCircle(0, 0, 2);
		drawer.lineColor = "red";
		drawer.line(0, 0, 10, 0);
	}

	public addChild<T extends GameObject>(object: T): T
	{
		this.children.push(object);
		object.parent = this;
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
	public r = 0;
	public sx = 1;
	public sy = 1;

	constructor(protected object: GameObject) { }

	public get global(): Transform
	{
		if (!this.object.parent) return this.copy();

		const p = this.object.parent.transform.global;
		const t = this.copy();


		const c = Math.cos(Utils.degToRad(p.r));
		const s = Math.sin(Utils.degToRad(p.r));
		t.x *= p.sx;
		t.y *= p.sy;
		const nx = t.x * c - t.y * s;
		const ny = t.x * s + t.y * c;
		t.x = nx + p.x;
		t.y = ny + p.y;

		t.r += p.r;

		const nsx = t.sx * c - t.sy * s;
		const nsy = t.sx * s + t.sy * c;
		t.sx = p.sx * nsx;
		t.sy = p.sy * nsy;

		return t;
	}

	public copy()
	{
		const t = new Transform(this.object);
		t.x = this.x;
		t.y = this.y;
		t.r = this.r;
		t.sx = this.sx;
		t.sy = this.sy;
		return t;
	}

}

export class TransformRect extends Transform
{
	public w = 0;
	public h = 0;
	public ox = 0.5;
	public oy = 0.5;

	public copy()
	{
		const t = new TransformRect(this.object);
		t.x = this.x;
		t.y = this.y;
		t.w = this.w;
		t.h = this.h;
		t.ox = this.ox;
		t.oy = this.oy;
		t.r = this.r;
		t.sx = this.sx;
		t.sy = this.sy;
		return t;
	}
}
