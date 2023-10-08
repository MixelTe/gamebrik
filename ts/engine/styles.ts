import { Props } from "./builder.js";


export class Styles
{
	public base?: Styles;

	constructor(private styles: StylesProp, public className = "", public prefix = "", public name = "")
	{
		this.base = styles.base;
	}

	public static fromObjects<T extends { [key: string]: StylesPropForMultipleCreation; }, K extends {
		[key in keyof T]: Styles;
	}>(obj: T, prefix?: string): K
	{
		const r: { [key: string]: Styles; } = {};
		Object.keys(obj).forEach(key =>
		{
			const v = obj[key];
			r[key] = new Styles({ ...v, base: typeof v.base == "string" ? undefined : v.base });
			r[key].name = key;
			r[key].prefix = prefix || "";
		});
		Object.keys(obj).forEach(key =>
		{
			const v = obj[key];
			if (typeof v.base == "string")
			{
				r[key].base = r[v.base];
				if (!r[key].base) console.error(`style with name ${v.base} does not exist`);
			}
		});

		return <K>r;
	}

	public static stylesToProps<T extends { [key: string]: Styles; }, K extends {
		[key in keyof T]: Props;
	}>(obj: T): K
	{
		const r: { [key: string]: Props; } = {};
		Object.keys(obj).forEach(key =>
		{
			r[key] = { styles: obj[key] };
		});

		return <K>r;
	}

	public static fromObjectsToProps<T extends { [key: string]: StylesPropForMultipleCreation; }, K extends {
		[key in keyof T]: Props;
	}>(obj: T): K
	{
		return this.stylesToProps(this.fromObjects(obj));
	}

	public static processStyles(styles: CssStyles)
	{
		return Object.keys(styles).map(key =>
		{
			let v = styles[key as keyof CssStyles] ?? "";
			if (typeof v == "number") v = `${v}px`;
			const p = key.split(/(?=[A-Z])/).map(v => v.toLocaleLowerCase()).join("-");
			return { p, v };
		}).filter(v => typeof v.v == "string").map(({ p, v }) => ({ p, v: `${v}` }));
	}

	public static createStyles(styles: Styles[])
	{
		const el = document.createElement("style");
		const styleText = styles.map(style =>
		{
			return Object.keys(style.styles).map(s =>
			{
				const v = style.styles[s] || {};
				if (v instanceof Styles) return null;

				let selector = "." + style.className;
				if (s != "normal") selector += ":" + s;

				return this.createStyleBlock(selector, v);
			}).filter(v => v).join("\n");
		}).join("\n");
		el.textContent = styleText;
		return el;
	}

	private static createStyleBlock(selector: string, styles: CssStyles)
	{
		let block = selector + " {\n";
		block += this.processStyles(styles).map(({ p, v }) => `  ${p}: ${v};`).join("\n");
		block += "\n}";
		return block;
	}
}

export interface StylesProp
{
	normal?: CssStyles,
	base?: Styles,
	[pseudoClass: string]: CssStyles | Styles | undefined,
}

export interface StylesPropForMultipleCreation extends Modify<StylesProp, {
	base?: Styles | string,
}> { }

type CssStylesDefault = {
	[P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] | number;
};
export interface CssStyles extends Modify<CssStylesDefault, {
	display?: "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "flow-root",
	justifyContent?: "center" | "start" | "end" | "flex-start" | "flex-end" | "left" | "right",
	alignItems?: "normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end",
	flexDirection?: "row" | "row-reverse" | "column" | "column-reverse",
	position?: "fixed" | "absolute" | "static" | "relative" | "stycky",
	fontWeight?: "bold" | "normal",
	textAlign?: "start" | "end" | "left" | "right" | "center" | "justify" | "justify-all" | "match-parent",
}> { }
type Modify<T, R> = Omit<T, keyof R> & R;
