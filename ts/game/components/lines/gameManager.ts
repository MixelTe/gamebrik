import { UserInputModule } from "../../../engine/gameObjectModules/userInputModule.js";
import { Drawer, GameObject, Utils } from "../../../engine/index.js";
import { BallColors } from "./ball.js";
import { Field } from "./field.js";

export class GameManager extends GameObject
{
	public static readonly ViewSize = 400;

	constructor(private field: Field)
	{
		super();
	}

	public Start()
	{
		const t1 = this.addChild(new Test(130, 100, "tomato"));
		t1.transform.sx = 1.4;
		const t2 = t1.addChild(new Test(20, 40, "azure"));
		t2.transform.r = 15;
		const t3 = t2.addChild(new Test(-60, 60, "wheat"));
		t3.addModule(UserInputModule);

		this.field.addBall(0, 0, BallColors.Blue);
		this.field.addBall(4, 2, BallColors.Yellow);
		this.field.addBall(6, 7, BallColors.Green);
		this.field.addBall(2, 6, BallColors.Purple);
		this.field.addBall(7, 5, BallColors.Red);

		this.field.addBall(2, 1, BallColors.Blue, true);
		this.field.addBall(6, 2, BallColors.Yellow, true);
		this.field.addBall(5, 8, BallColors.Green, true);
		this.field.addBall(3, 6, BallColors.Purple, true);
		this.field.addBall(6, 4, BallColors.Red, true);
	}
}


export class Test extends GameObject
{
	constructor(private x: number, private y: number, private color: string, private move = false) { super() };

	public Start(): void
	{
		this.transform.w = 100;
		this.transform.h = 50;
	}

	public Update(t: number): void
	{
		if (!this.move)
		{
			this.transform.x = this.x;
			this.transform.y = this.y;
			return
		};
		this.transform.x = Utils.pingPong(this.x - 10, this.x + 10, t / 1000);
		this.transform.y = Utils.pingPong(this.y - 10, this.y + 10, t / 1000);
	}

	public Draw(D: Drawer)
	{
		D.fillColor = this.color;
		D.fillRect(0, 0, this.transform.w, this.transform.h);
	}
}