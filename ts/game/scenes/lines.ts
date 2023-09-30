import { Builder, Engine, Scene, Styles } from "../../engine/index.js";
import { Field } from "../components/lines/field.js";
import { GameManager } from "../components/lines/gameManager.js";
import { Colors, Fonts, Images, StylesBase } from "../res.js";
import SceneIds from "../scenes.js";

export class SceneLines extends Scene
{
	public Start(B: Builder)
	{
		B.layout({ ...styles.layout, width: 500 }, () =>
		{
			B.div(styles.header, () =>
			{
				B.button({ ...styles.button, onClick: () => Engine.startScene(SceneIds.start) }, Images.backArrow);
				B.div(styles.title, "Lines");
			})
		}, () =>
		{
			B.canvas({ css: { margin: 8 } });
		});

		this.setViewSize(400, 400);

		this.addComponent(new GameManager());
		this.addComponent(new Field());
	}
}

const texts = Engine.localize({
	lang: { en: "En", ru: "Ru" },
	title: { en: "Gamebrik", ru: "Игрубрик" },
	game1: { en: "Lines", ru: "Lines" },
	game2: { en: "Another game", ru: "Другая игра" },
	game3: { en: "One more game", ru: "Ещё одна игра" },
});

const styles = Styles.fromObjectsToProps({
	layout: {
		normal: {
			background: Colors.backgroundGradient,
			userSelect: "none",
		}
	},
	header: {
		normal: {
			display: "flex",
			margin: 8,
		}
	},
	button: {
		base: StylesBase.button,
		normal: {
			width: 48,
			height: 48,
			fontSize: 32,
		}
	},
	title: {
		base: StylesBase.title,
		normal: {
			flexGrow: "1",
			textAlign: "center",
		}
	},
});