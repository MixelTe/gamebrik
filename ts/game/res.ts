import { SceneBuilder, Styles } from "../engine/index.js"

export const Colors = {
	background: "#edd29e",
	backgroundGradient: "linear-gradient(135deg, #f7e4bf, #e3bd77)",
	text: "#087502",
	primary: "#55d94c",
	primaryDark: "#27931f",
	secondary: "#ffe6c4",
}

export const Fonts = {
	normal: "Pangolin",
	title: "Neucha",
}

export const Images = {
	backArrow: SceneBuilder.loadSvg("./res/arrow_back.svg", "fill"),
}

export const StylesBase = Styles.fromObjects({
	button: {
		normal: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			fontSize: 20,
			backgroundColor: Colors.secondary,
			border: "3px solid " + Colors.primary,
			color: Colors.text,
			fontFamily: Fonts.normal,
			cursor: "pointer",
			outline: "none",
			borderRadius: 16,
			transitionProperty: "box-shadow",
			transitionDuration: "150ms",
		},
		hover: {
			boxShadow: `0px 0px 6px ${Colors.primary}, inset 0px 0px 3px ${Colors.primary}`,
		},
		active: {
			boxShadow: `0px 0px 12px ${Colors.primary}, inset 0px 0px 5px ${Colors.primary}`,
		},
		"focus-visible": {
			borderColor: Colors.primaryDark
		},
	},
	bigButton: {
		base: "button",
		normal: {
			fontSize: 24,
			borderWidth: 4,
			borderRadius: "16px 8px 16px 8px / 24px 8px 24px 8px",
			boxShadow: `5px 4px 3px ${Colors.primary}, inset 0px 0px 0px -1px ${Colors.primary}`,
			transitionProperty: "box-shadow, transform",
			transitionDuration: "150ms",
		},
		hover: {
			boxShadow: `5px 4px 3px ${Colors.primary}, inset 0px 0px 3px 1px ${Colors.primary}`,
		},
		active: {
			transform: "translate(2px, 2px)",
			boxShadow: `3px 2px 3px ${Colors.primary}, inset 0px 0px 3px 1px ${Colors.primary}`,
		},
	},
	title: {
		normal: {
			fontSize: "3rem",
			fontFamily: Fonts.title,
			color: Colors.text,
			fontWeight: "bold",
			filter: `drop-shadow(2px 2px 8px ${Colors.primaryDark})`,
			letterSpacing: 5,
		}
	},
}, "base");
