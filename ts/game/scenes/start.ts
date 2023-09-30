import { Builder, Engine, Scene, Styles } from "../../engine/index.js";
import { Colors, StylesBase } from "../res.js";
import SceneIds from "../scenes.js";

export class SceneStart extends Scene
{
	public Start(B: Builder)
	{
		B.layout({ ...styles.layout, width: 800 }, null, () =>
		{
			B.button({ ...styles.langSwitch, onClick: () => Engine.changeLang() }, B.sync(texts.lang));
			B.div(styles.container, () =>
			{
				B.div(styles.title, B.sync(texts.title));
				B.div(styles.menu, () =>
				{
					B.button({ ...styles.button, onClick: () => Engine.startScene(SceneIds.lines) }, B.sync(texts.game1));
					B.button({ ...styles.button, onClick: () => Engine.startScene(SceneIds.lines) }, B.sync(texts.game2));
					B.button({ ...styles.button, onClick: () => Engine.startScene(SceneIds.lines) }, B.sync(texts.game3));
				})
			})
		});
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
	langSwitch: {
		base: StylesBase.button,
		normal: {
			position: "fixed",
			width: 48,
			height: 48,
			margin: 8,
		},
	},
	container: {
		normal: {
			display: "grid",
			gridAutoRows: "1fr 2fr",
			justifyContent: "center",
			alignItems: "center",
		}
	},
	title: {
		base: StylesBase.title,
		normal: {
			fontSize: "clamp(5rem, 10vw, 7rem)",
		}
	},
	menu: {
		normal: {
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			gap: 16,
		}
	},
	button: {
		base: StylesBase.bigButton,
		normal: {
			width: 240,
			paddingBlock: 12,
		},
	},
});