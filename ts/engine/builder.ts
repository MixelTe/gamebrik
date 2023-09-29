import { Random } from "./random.js";
import { Scene } from "./scene.js";

export class Builder
{
	private styles = new Set<Styles>();
	private contextStack: HTMLElement[] = [];
	private context: HTMLElement;
	private prefix: string;
	private stylesEl: HTMLStyleElement | null = null;
	private langSync: (() => void)[] = [];

	constructor(scene: Scene)
	{
		this.prefix = scene.constructor.name;
		this.context = scene.root;
	}

	public initEl<K extends keyof HTMLElementTagNameMap>(tagName: K, props?: Props, content?: Content)
	{
		const el = document.createElement(tagName);
		if (this.context) this.context.appendChild(el);

		this.contextStack.push(this.context);
		this.context = el;

		if (props)
		{
			if (props.styles)
			{
				if (!props.styles.className.startsWith(this.prefix))
				{
					props.styles.className = [this.prefix, tagName, Random.string()].join("_");
				}
				el.classList.add(props.styles.className);
				this.styles.add(props.styles);
			}
			if (props.css)
			{
				Styles.processStyles(props.css).forEach(({ p, v }) =>
				{
					el.style.setProperty(p, v);
				});
			}
			if (props.onClick)
			{
				el.onclick = props.onClick;
			}
		}

		if (content)
			this.appendContent(content);

		this.context = this.contextStack.pop()!;

		return el;
	}

	private appendContent(content: Content)
	{
		if (typeof content == "number" || typeof content == "string")
		{
			this.context.append(`${content}`);
		}
		else if (typeof content == "function")
		{
			const r = content();
			if (r) this.appendContent(r);
		}
		else if (typeof content == "object")
		{
			this.context.appendChild(content);
		}
	}

	public _addStyles()
	{
		if (this.stylesEl)
			document.head.removeChild(this.stylesEl);

		if (this.styles.size > 0)
		{
			this.stylesEl = Styles.createStyles(Array.from(this.styles));
			document.head.appendChild(this.stylesEl);
		}
	}

	public _updateLang()
	{
		this.langSync.forEach(el => el());
	}

	public _removeStyles()
	{
		if (this.stylesEl)
		{
			document.head.removeChild(this.stylesEl);
			this.stylesEl = null;
		}
	}

	public sync(content: Content)
	{
		return () =>
		{
			const parent = this.context;
			const update = () =>
			{
				console.log("some log for testing");
				const context = this.context;
				this.context = parent;
				this.context.innerHTML = "";
				this.appendContent(content);
				this.context = context;
			}
			this.langSync.push(update)
			update();
		}
	}

	public layout(props?: PropsLayout, header?: Content | null, content?: Content, footer?: Content)
	{
		return this.initEl("div", {
			...props, css: {
				...props?.css,
				display: "flex",
				height: "100%",
				justifyContent: "center",
			}
		}, () =>
		{
			this.div({
				css: {
					display: "grid",
					gridTemplateRows: (header && footer) ? "auto 1fr auto" : footer ? "1fr auto" : "1fr",
					height: "100%",
					width: "100%",
					maxWidth: props?.width,
				}
			}, () =>
			{
				if (header)
					this.appendContent(header);
				if (content)
					this.appendContent(content);
				if (footer)
					this.appendContent(footer);
			})
		});
	}

	public div(props?: Props, content?: Content)
	{
		return this.initEl("div", props, content);
	}

	public button(props?: Props, content?: Content)
	{
		return this.initEl("button", props, content);
	}
}

export class Styles
{
	constructor(private styles: StylesProp, public className = "") { }

	public static fromObjects<T extends { [key: string]: StylesProp }, K extends { [key in keyof T]: Styles }>(obj: T): K
	{
		const r: { [key: string]: Styles } = {};
		Object.keys(obj).forEach(key =>
		{
			r[key] = new Styles(obj[key]);
		})

		return <K>r;
	}

	public static stylesToProps<T extends { [key: string]: Styles }, K extends { [key in keyof T]: Props }>(obj: T): K
	{
		const r: { [key: string]: Props } = {};
		Object.keys(obj).forEach(key =>
		{
			r[key] = { styles: obj[key] };
		})

		return <K>r;
	}

	public static fromObjectsToProps<T extends { [key: string]: StylesProp }, K extends { [key in keyof T]: Props }>(obj: T): K
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
				const v = style.styles[s as keyof StylesProp] || {};

				let selector = "." + style.className;
				if (s != "normal") selector += ":" + s;

				return this.createStyleBlock(selector, v);
			}).join("\n");
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

type Content = string | number | HTMLElement | (() => void | Content);

interface Props
{
	css?: CssStyles,
	styles?: Styles,
	onClick?: (e: MouseEvent) => void,
}

interface StylesProp
{
	normal?: CssStyles,
	[pseudoClass: string]: CssStyles | undefined,
}

type CssStylesDefault = {
	[P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] | number;
};
interface CssStyles extends Modify<CssStylesDefault, {
	display?: "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "flow-root",
	justifyContent?: "center" | "start" | "end" | "flex-start" | "flex-end" | "left" | "right",
	alignItems?: "normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end",
	flexDirection?: "row" | "row-reverse" | "column" | "column-reverse",
	position?: "fixed" | "absolute" | "static" | "relative" | "stycky",
}> { }
type Modify<T, R> = Omit<T, keyof R> & R;

interface PropsLayout extends Props
{
	width?: string | number,
}
