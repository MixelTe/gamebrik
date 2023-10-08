import { Builder } from "./builder.js";
import { GameObject } from "./gameObject.js";
import { Styles } from "./styles.js";

export class Inspector
{
	private root = new GameObject();
	private shown = false;

	constructor() { };

	public show()
	{
		if (this.shown) return;
		this.shown = true;
		const B = new Builder("inspector", document.body);
		B.addAllStyles(styles);
		const root = B.div(styles.root, () =>
		{
			B.div(styles.header, () =>
			{
				B.button({
					...styles.btnArrow, onClick(e)
					{
						root.classList.toggle(styles.root_left.styles.className);
					},
				}, "<");
				B.div(styles.title, "Inspector");
				B.button({
					...styles.btnArrow, onClick(e)
					{
						root.classList.toggle(styles.root_collapsed.styles.className);
					},
				}, ">");
			})
		});
		B._addStyles();
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

const styles = Styles.fromObjectsToProps({
	root: {
		normal: {
			position: "fixed",
			top: 0,
			right: 0,
			backgroundColor: "#282828",
			width: 300,
			height: "100dvh",
			color: "#e8eaed",
			fontFamily: "Arial",
		},
	},
	root_left: {
		normal: {
			right: "auto",
			left: 0,
		},
	},
	root_collapsed: {
		normal: {
			right: -272,
		},
		"!.$$.$root_left": {
			left: -272,
		},
	},
	header: {
		normal: {
			backgroundColor: "#3c3c3c",
			display: "flex",
			alignItems: "center",
		},
		"!.$root_left .$$": {
			flexDirection: "row-reverse",
		},
	},
	btnArrow: {
		normal: {
			background: "transparent",
			border: "none",
			color: "#e8eaed",
			height: 28,
			width: 28,
		},
	},
	title: {
		normal: {
			flexGrow: "1",
			textAlign: "center",
		},
	},
});