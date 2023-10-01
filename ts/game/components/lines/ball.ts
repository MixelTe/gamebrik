import { Drawer, GameObject } from "../../../engine/index.js";
import { Field } from "./field.js";
import { GameManager } from "./gameManager.js";

export class Ball extends GameObject
{
	public x = 0;
	public y = 0;
	public color: BallColors = BallColors.Blue;
	public small = true;

	public Start()
	{
		this.transform.w = GameManager.ViewSize / Field.Size;
		this.transform.h = GameManager.ViewSize / Field.Size;
	}

	public Update(t: number): void
	{
		this.transform.x = this.x * this.transform.w;
		this.transform.y = this.y * this.transform.w;
	}

	public Draw(D: Drawer)
	{
		const r = this.transform.w / 2;

		let color = "";
		if (this.color == BallColors.Blue) color = "#00859d";
		else if (this.color == BallColors.Green) color = "#00c700";
		else if (this.color == BallColors.Purple) color = "#ef00ff";
		else if (this.color == BallColors.Red) color = "#ff0000";
		else if (this.color == BallColors.Yellow) color = "#ffb300";

		if (this.small) this.drawSmall(D, r, color);
		else this.draw(D, r, color);
	}

	private draw(D: Drawer, r: number, color: string)
	{
		D.fillColor = color;
		D.fillCircle(r, r, r * 0.8);

		const gradient2 = D.createRadialGradient(r, r * 1.5, 0, r, r, r);
		gradient2.addColorStop(0, color);
		gradient2.addColorStop(0.65, color);
		gradient2.addColorStop(0.85, "white");
		gradient2.addColorStop(1, "white");
		D.fillColor = gradient2;
		D.fillElipse(r, r * 0.75, r * 0.65, r * 0.5);
		D.fillColor = "#ffffff22";
		D.fillElipse(r, r * 0.75, r * 0.65, r * 0.5);

		const gradient1 = D.createRadialGradient(r, r * 2, 0, r, r, r);
		gradient1.addColorStop(0, "#ffffff88");
		gradient1.addColorStop(0.15, "#ffffff88");
		gradient1.addColorStop(0.6, "#ffffff00");
		gradient1.addColorStop(1, "#ffffff00");
		D.fillColor = gradient1;
		D.fillCircle(r, r * 0.9, r * 0.8);
	}
	private drawSmall(D: Drawer, r: number, color: string)
	{
		D.fillColor = color;
		D.fillCircle(r, r, r * 0.4);

		const gradient = D.createRadialGradient(r * 1.2, r * 0.8, 0, r, r, r * 0.4);
		gradient.addColorStop(0, "#ffffff99");
		gradient.addColorStop(0.8, "#ffffff00");
		gradient.addColorStop(1, "#ffffff00");
		D.fillColor = gradient;
		D.fillCircle(r, r, r * 0.4);
	}
}

export enum BallColors
{
	Red,
	Yellow,
	Green,
	Blue,
	Purple,
}