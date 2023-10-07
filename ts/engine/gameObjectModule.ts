import { Drawer } from "./drawer.js";
import { GameObject } from "./gameObject.js";

export class GameObjectModule
{
	constructor(protected object: GameObject) { }

	public onDraw(drawer: Drawer) { }
}