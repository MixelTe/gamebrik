import { UserInputModule } from "../../../engine/gameObjectModules/userInputModule.js";
import { Drawer, GameObject, PictureModule, Utils } from "../../../engine/index.js";
import { BallColors } from "./ball.js";
import { Field } from "./field.js";

export class GameManager extends GameObject
{
	public static readonly ViewSize = 400;

	private t1?: Test;
	private t2?: Test;
	private t3?: Test;

	constructor(private field: Field)
	{
		super();
	}

	public Start()
	{
		this.t1 = this.addChild(new Test(130, 100, 100, 50, "#ff000050"));
		// this.t1.transform.sx = 1.4;
		this.t2 = this.t1.addChild(new Test(20, 40, 150, 50, "#00ff0050", true));
		this.t2.transform.r = 15;
		this.t3 = this.t2.addChild(new Test(-60, 60, 90, 50, "#0000ff50", false));
		this.t3.addModule(UserInputModule);

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

	public Draw(drawer: Drawer): void
	{
		drawer.lineColor = "red";
		drawer.lineWidth = 2;
		if (this.t1) drawer.drawTransform(this.t1?.transform.global);
		if (this.t2) drawer.drawTransform(this.t2?.transform.global);
		if (this.t3) drawer.drawTransform(this.t3?.transform.global);
	}
}


export class Test extends GameObject
{
	private picture = this.addModule(TestPicture);
	constructor(private x: number, private y: number, private w: number, private h: number, private color: string, private move = false) { super() };

	public Update(t: number): void
	{
		this.picture.transform.w = this.w;
		this.picture.transform.h = this.h;
		this.picture.color = this.color;
		this.transform.x = this.x;
		this.transform.y = this.y;
		if (!this.move) return;

		// this.transform.x = Utils.pingPong(this.x - 10, this.x + 10, t / 5000);
		// this.transform.y = Utils.pingPong(this.y - 10, this.y + 10, t / 5000);

		this.transform.r = Utils.pingPong(-60, 20, t / 5000);
	}
}

class TestPicture extends PictureModule
{
	public color = "";

	public Draw(D: Drawer)
	{
		D.fillColor = this.color;
		D.fillRect(0, 0, this.transform.w, this.transform.h);
	}
}