import { Builder, Engine, Scene, Styles } from "../../engine/index.js";

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
					B.button(styles.button, B.sync(texts.game1));
					B.button(styles.button, B.sync(texts.game2));
					B.button(styles.button, B.sync(texts.game3));
				})
			})
		});
	}
}

const texts = Engine.localize({
	lang: { en: "En", ru: "Ru" },
	title: { en: "Gamebrik", ru: "Игрубрик" },
	game1: { en: "Game 1", ru: "Игра 1" },
	game2: { en: "Another game", ru: "Другая игра" },
	game3: { en: "One more game", ru: "Ещё одна игра" },
});

const styles = Styles.fromObjectsToProps({
	layout: {
		normal: {
			background: "linear-gradient(135deg, #f7e4bf, #e3bd77)",
		}
	},
	langSwitch: {
		normal: {
			position: "fixed",
			width: 48,
			height: 48,
			margin: 8,
			fontSize: 20,
			backgroundColor: "#ffe6c4",
			border: "3px solid #55d94c",
			color: "#087502",
			fontFamily: "Pangolin",
			cursor: "pointer",
			outline: "none",
			borderRadius: 16,
			transitionProperty: "box-shadow",
			transitionDuration: "150ms",
		},
		hover: {
			boxShadow: "0px 0px 6px #55d94c, inset 0px 0px 3px #55d94c",
		},
		active: {
			boxShadow: "0px 0px 12px #55d94c, inset 0px 0px 5px #55d94c",
		},
		"focus-visible": {
			borderColor: "#27931f"
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
		normal: {
			fontSize: "clamp(5rem, 10vw, 7rem)",
			fontFamily: "Neucha",
			letterSpacing: 5,
			color: "#087502",
			fontWeight: "bold",
			filter: "drop-shadow(2px 2px 8px #0da304)",
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
		normal: {
			width: 240,
			paddingBlock: 12,
			fontSize: 24,
			backgroundColor: "#ffe6c4",
			border: "4px solid #55d94c",
			color: "#087502",
			fontFamily: "Pangolin",
			cursor: "pointer",
			outline: "none",
			borderRadius: "16px 8px 16px 8px / 24px 8px 24px 8px",
			boxShadow: "5px 4px 3px #55d94c, inset 0px 0px 0px -1px #55d94c",
			transitionProperty: "box-shadow, transform",
			transitionDuration: "150ms",
		},
		hover: {
			boxShadow: "5px 4px 3px #55d94c, inset 0px 0px 3px 1px #55d94c",
		},
		active: {
			transform: "translate(2px, 2px)",
			boxShadow: "3px 2px 3px #55d94c, inset 0px 0px 3px 1px #55d94c",
		},
		"focus-visible": {
			borderColor: "#27931f"
		},
	},
});