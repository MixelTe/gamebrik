import { Transform } from "./gameObject.js";
import { Utils } from "./utils.js";

export class Drawer
{
	private ctx: CanvasRenderingContext2D;
	private onResize = this.resizeCanvas.bind(this);
	private viewSize = { width: 800, height: 600 };
	private transform = { dx: 0, dy: 0, m: 1 };

	constructor(private canvas: HTMLCanvasElement)
	{
		this.ctx = canvas.getContext("2d")!;
		window.addEventListener("resize", this.onResize);
		canvas.width = 0;
	}

	public _clear()
	{
		if (this.canvas.width == 0)
			this.resizeCanvas();

		this.ctx.resetTransform();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.translate(this.transform.dx, this.transform.dy);
		this.ctx.scale(this.transform.m, this.transform.m);
	}

	public _destroy()
	{
		window.removeEventListener("resize", this.onResize);
	}

	public _setViewSize(width: number, height: number)
	{
		this.viewSize.width = width;
		this.viewSize.height = height;
		this.updateTransform();
	}

	private updateTransform()
	{
		const mx = this.canvas.width / this.viewSize.width;
		const my = this.canvas.height / this.viewSize.height;
		const m = Math.min(mx, my);
		this.transform.m = m;
		this.transform.dx = Math.floor((this.canvas.width - this.viewSize.width * m) / 2);
		this.transform.dy = Math.floor((this.canvas.height - this.viewSize.height * m) / 2);
	}

	private resizeCanvas()
	{
		const parent = this.canvas.parentElement;
		if (parent)
		{
			this.canvas.width = 0;
			this.canvas.height = 0;
			const rect = parent.getBoundingClientRect();
			this.canvas.width = rect.width;
			this.canvas.height = rect.height;
			this.updateTransform();
		}
	}

	public applyObjectTransform(t: Transform)
	{
		this.ctx.translate(t.x, t.y);
		const drx = t.w * t.ox;
		const dry = t.h * t.oy;
		this.ctx.translate(drx, dry);
		this.ctx.rotate(Utils.degToRad(t.r));
		this.ctx.translate(-drx, -dry);

		this.ctx.translate(drx * (1 - t.sx), dry * (1 - t.sy));
		this.ctx.scale(t.sx, t.sy);
	}

	public get fillColor()
	{
		return this.ctx.fillStyle;
	}
	public set fillColor(v: string | CanvasGradient | CanvasPattern)
	{
		this.ctx.fillStyle = v;
	}

	public get lineColor()
	{
		return this.ctx.strokeStyle;
	}
	public set lineColor(v: string | CanvasGradient | CanvasPattern)
	{
		this.ctx.strokeStyle = v;
	}

	public get lineWidth()
	{
		return this.ctx.lineWidth;
	}
	public set lineWidth(v: number)
	{
		this.ctx.lineWidth = v;
	}

	public get width()
	{
		return this.viewSize.width;
	}
	public get height()
	{
		return this.viewSize.height;
	}

	public createLinearGradient = (x0: number, y0: number, x1: number, y1: number) => this.ctx.createLinearGradient(x0, y0, x1, y1);
	public createRadialGradient = (x0: number, y0: number, r0: number, x1: number, y1: number, r1: number) => this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
	public createConicGradient = (startAngle: number, x: number, y: number) => this.ctx.createConicGradient(Utils.degToRad(startAngle), x, y);
	public save = () => this.ctx.save();
	public restore = () => this.ctx.restore();

	public fillRect(rect: Rect, r?: number): void
	public fillRect(x: number, y: number, w: number, h: number, r?: number): void
	public fillRect(rect_x: number | Rect, r_y = 0, w_?: number, h_?: number, r_: number = 0): void
	{
		this.rect(rect_x, r_y, w_ || 0, h_ || 0, r_, true);
	}

	public strokeRect(rect: Rect, r?: number): void
	public strokeRect(x: number, y: number, w: number, h: number, r?: number): void
	public strokeRect(rect_x: number | Rect, r_y = 0, w_?: number, h_?: number, r_: number = 0): void
	{
		this.rect(rect_x, r_y, w_ || 0, h_ || 0, r_, false);
	}

	public rect(rect_x: number | Rect, r_y: number, w_: number, h_: number, r_: number, fill: boolean)
	{
		let x, y, w, h, r;
		if (typeof rect_x == "object")
		{
			x = rect_x.x;
			y = rect_x.y;
			w = rect_x.w;
			h = rect_x.h;
			r = r_y;
		}
		else
		{
			x = rect_x;
			y = r_y;
			w = w_;
			h = h_;
			r = r_;
		}

		if (r == 0)
		{
			if (fill) this.ctx.fillRect(x, y, w, h);
			else this.ctx.strokeRect(x, y, w, h);
		}
		else
		{
			this.ctx.beginPath();
			this.ctx.roundRect(x, y, w, h, r);
			if (fill) this.ctx.fill();
			else this.ctx.stroke();
		}
	}

	public image(imgObj: GameImage, x: number, y: number, w: number, h: number)
	{
		const img = imgObj.get();

		if (img)
			this.ctx.drawImage(img, x, y, w, h);
		else
			this.fillRect(x, y, w, h);
	}

	public line(x1: number, y1: number, x2: number, y2: number)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}

	public fillCircle(x: number, y: number, r: number, a0 = 0, a1 = 360, counterclockwise = true)
	{
		this.circle(x, y, r, a0, a1, counterclockwise, true);
	}
	public strokeCircle(x: number, y: number, r: number, a0 = 0, a1 = 360, counterclockwise = true)
	{
		this.circle(x, y, r, a0, a1, counterclockwise, false);
	}
	private circle(x: number, y: number, r: number, a0: number, a1: number, counterclockwise: boolean, fill: boolean)
	{
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, Utils.degToRad(a0), Utils.degToRad(a1), counterclockwise);
		if (fill) this.ctx.fill();
		else this.ctx.stroke();
	}

	public fillElipse(x: number, y: number, rx: number, ry: number, rotation = 0, a0 = 0, a1 = 360, counterclockwise = true)
	{
		this.elipse(x, y, rx, ry, rotation, a0, a1, counterclockwise, true);
	}
	public strokeElipse(x: number, y: number, rx: number, ry: number, rotation = 0, a0 = 0, a1 = 360, counterclockwise = true)
	{
		this.elipse(x, y, rx, ry, rotation, a0, a1, counterclockwise, false);
	}
	private elipse(x: number, y: number, rx: number, ry: number, rotation: number, a0: number, a1: number, counterclockwise: boolean, fill: boolean)
	{
		this.ctx.beginPath();
		this.ctx.ellipse(x, y, rx, ry, Utils.degToRad(rotation), Utils.degToRad(a0), Utils.degToRad(a1), counterclockwise);
		if (fill) this.ctx.fill();
		else this.ctx.stroke();
	}
}

export class GameImage
{
	private img = new Image();
	private loaded = false;

	constructor(url: string)
	{
		this.img.onload = () =>
		{
			this.loaded = true;
		}
		this.img.src = url;
	}

	public get()
	{
		if (this.loaded)
			return this.img;
		return null;
	}
}

export interface Rect
{
	x: number,
	y: number,
	w: number,
	h: number,
}