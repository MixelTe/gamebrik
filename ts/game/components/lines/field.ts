import { Drawer, GameObject } from "../../../engine/index.js";

export class Field extends GameObject
{
	public Start()
	{
		this.addComponent(new TestObj());
	}

	public Draw(D: Drawer)
	{
		const gradient = D.createLinearGradient(0, 0, D.width, D.height);
		gradient.addColorStop(0, "lightblue");
		gradient.addColorStop(1, "lightgreen");
		D.fillColor = gradient;
		D.fillRect(0, 0, D.width, D.height);

		const dx = D.width / 9;
		const dy = D.height / 9;
		for (let i = 1; i < 9; i++)
		{
			D.line(Math.floor(dx * i), 0, Math.floor(dx * i), D.height);
			D.line(0, Math.floor(dy * i), D.width, Math.floor(dy * i));
		}
	}
}

class TestObj extends GameObject
{
	public Start()
	{
		this.transform.x = 63;
		this.transform.y = 30;
		this.transform.w = 50;
		this.transform.h = 25;
		this.transform.r = 45;
		// this.transform.sx = 1.5;
		// this.transform.sy = 3;
	}

	public Draw(D: Drawer)
	{
		const gradient = D.createLinearGradient(0, 0, this.transform.w, this.transform.h);
		gradient.addColorStop(0, "blue");
		gradient.addColorStop(1, "lime");
		D.fillColor = gradient;
		D.fillRect(0, 0, this.transform.w, this.transform.h);
	}

	public Update(t: number)
	{
		this.transform.sx = Math.abs(500 - t % 1000) / 500 + 0.5;
		this.transform.sy = Math.abs(500 - t % 1000) / 500 + 0.5;
		this.transform.r = t / 10 % 360;
		this.transform.x = Math.abs(200 - t / 10 % 400) + 100;
		this.transform.y = Math.abs(200 - t / 20 % 400) + 100;
	}
}