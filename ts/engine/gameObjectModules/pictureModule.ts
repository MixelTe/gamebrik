import { Drawer } from "../drawer.js";
import { TransformRect } from "../gameObject.js";
import { GameObjectModule } from "../gameObjectModule.js";

export class PictureModule extends GameObjectModule
{
	public transform = new TransformRect(this.object);

	public onDraw(drawer: Drawer): void
	{
		drawer.applyObjectTransformRect(this.transform);
		drawer.save();
		this.Draw(drawer);
		drawer.restore();
	}

	public Draw(drawer: Drawer)
	{
		drawer.fillColor = "tomato";
		drawer.fillRect(this.transform);
	}
}
