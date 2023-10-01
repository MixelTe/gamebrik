import { Drawer, GameObject } from "../../../engine/index.js";
import { Ball, BallColors } from "./ball.js";
import { GameManager } from "./gameManager.js";

export class Field extends GameObject
{
	public static readonly Size = 9;
	private balls: (Ball | null)[] = [];

	public Start()
	{
		this.transform.w = GameManager.ViewSize;
		this.transform.h = GameManager.ViewSize;

		for (let i = 0; i < Field.Size * Field.Size; i++)
			this.balls.push(null);
	}

	public addBall(x: number, y: number, color: BallColors, big = false)
	{
		const ball = new Ball();
		this.addChild(ball);
		this.balls[x * y * Field.Size] = ball;
		ball.x = x;
		ball.y = y;
		ball.color = color;
		ball.small = !big;
	}

	public Draw(D: Drawer)
	{
		D.fillColor = "#fff1e7";
		D.fillRect(this.transform, 10);

		const cell = this.transform.w / Field.Size;

		D.lineColor = "#eccebb";
		D.lineWidth = 3;
		const d = 1.5;
		for (let i = 1; i < Field.Size; i++)
		{
			D.line(Math.floor(cell * i) + d, 0, Math.floor(cell * i) + d, this.transform.h);
			D.line(0, Math.floor(cell * i) + d, this.transform.w, Math.floor(cell * i) + d);
		}

		D.lineColor = "#b97c56";
		D.lineWidth = 1;
		for (let i = 1; i < Field.Size; i++)
		{
			D.line(Math.floor(cell * i), 0, Math.floor(cell * i), this.transform.h);
			D.line(0, Math.floor(cell * i), this.transform.w, Math.floor(cell * i));
		}
	}
}
