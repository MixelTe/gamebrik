import { GameObject } from "./gameObject.js";

export class Inspector
{
	private root = new GameObject();
	private shown = false;

	constructor() { };

	public show()
	{
		if (this.shown) return;
		this.shown = true;

	}

	public setRoot(object: GameObject)
	{
		this.root = object;
	}

	public update()
	{
		if (!this.shown) return;
		
	}
}