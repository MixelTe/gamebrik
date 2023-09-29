import { Builder } from "./builder.js";

export class Scene
{
	public readonly root = document.createElement("div");
	private builder = new Builder(this);

	public _engineEvent(event: "start" | "exit" | "langChange")
	{
		if (event == "start")
		{
			this.Start(this.builder);
			this.builder._addStyles();
		}
		else if (event == "exit")
		{
			this.Exit();
			this.builder._removeStyles();
		}
		else if (event == "langChange")
		{
			this.builder._updateLang();
		}
	}

	public Start(builder: Builder)
	{

	}

	public Exit()
	{

	}
}