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

	constructor(private scene: Scene)
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
				let styles: Styles | undefined = props.styles;
				const newStyles: Styles[] = [];

				while (styles)
				{
					if (!styles.className || (!styles.prefix && !styles.className.startsWith(this.prefix)))
					{
						styles.className = [styles.prefix || this.prefix, styles.name || tagName, Random.string()].join("_");
					}
					newStyles.push(styles);

					styles = styles.base;
				}

				for (let i = newStyles.length - 1; i >= 0; i--)
				{
					el.classList.add(newStyles[i].className);
					this.styles.add(newStyles[i]);
				}
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
					gridTemplateRows: [header && "auto", content && "1fr", footer && "auto"].filter(v => v).join(" "),
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

	public img(props?: Props, url?: string)
	{
		const img = this.initEl("img", props);
		img.src = url || "";
		return img;
	}

	public canvas(props?: Props)
	{
		const canvas = document.createElement("canvas");
		const div = this.div({ ...props, css: { ...props?.css, display: "flex" } }, () => canvas);
		this.scene._initCanvas(canvas);
		return div;
	}

	public static loadSvg(url: string, color: "fill" | "stroke" | "both" | "none" = "none")
	{
		let svgTemplate: HTMLTemplateElement | null = null;
		let onLoad: ((svgTemplate: HTMLTemplateElement) => void)[] = [];
		fetch(url).then(r => r.text()).then(r =>
		{
			svgTemplate = document.createElement("template");
			svgTemplate.innerHTML = r;

			const svg = svgTemplate.content.firstChild;
			if (svg instanceof SVGElement)
			{
				svg.style.width = "1em";
				svg.style.height = "1em";
				if (color == "fill" || color == "both")
					svg.style.fill = "currentColor";
				if (color == "stroke" || color == "both")
					svg.style.stroke = "currentColor";
			}

			const st = svgTemplate;
			onLoad.forEach(f => f(st));
			onLoad = [];
		});
		return () =>
		{
			const svg = svgTemplate?.content?.cloneNode(true);
			if (svg) return svg;
			const stub = document.createElement("span");
			onLoad.push(svgTemplate =>
			{
				const parent = stub.parentNode;
				if (!parent) return;
				const svg = svgTemplate?.content?.cloneNode(true);
				parent.insertBefore(svg, stub);
				parent.removeChild(stub);
			});
			return stub;
		}
	}
}

export class Styles
{
	public base?: Styles;

	constructor(private styles: StylesProp, public className = "", public prefix = "", public name = "")
	{
		this.base = styles.base;
	}

	public static fromObjects<T extends { [key: string]: StylesPropForMultipleCreation }, K extends { [key in keyof T]: Styles }>(obj: T, prefix?: string): K
	{
		const r: { [key: string]: Styles } = {};
		Object.keys(obj).forEach(key =>
		{
			const v = obj[key];
			r[key] = new Styles({ ...v, base: typeof v.base == "string" ? undefined : v.base });
			r[key].name = key;
			r[key].prefix = prefix || "";
		})
		Object.keys(obj).forEach(key =>
		{
			const v = obj[key];
			if (typeof v.base == "string")
			{
				r[key].base = r[v.base];
				if (!r[key].base) console.error(`style with name ${v.base} does not exist`);
			}
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

	public static fromObjectsToProps<T extends { [key: string]: StylesPropForMultipleCreation }, K extends { [key in keyof T]: Props }>(obj: T): K
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

type Content = string | number | Node | (() => void | Content);

interface Props
{
	css?: CssStyles,
	styles?: Styles,
	onClick?: (e: MouseEvent) => void,
}

interface StylesProp
{
	normal?: CssStyles,
	base?: Styles,
	[pseudoClass: string]: CssStyles | Styles | undefined,
}

interface StylesPropForMultipleCreation extends Modify<StylesProp, {
	base?: Styles | string,
}> { }

type CssStylesDefault = {
	[P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] | number;
};
interface CssStyles extends Modify<CssStylesDefault, {
	display?: "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "flow-root",
	justifyContent?: "center" | "start" | "end" | "flex-start" | "flex-end" | "left" | "right",
	alignItems?: "normal" | "stretch" | "center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end",
	flexDirection?: "row" | "row-reverse" | "column" | "column-reverse",
	position?: "fixed" | "absolute" | "static" | "relative" | "stycky",
	fontWeight?: "bold" | "normal",
	textAlign?: "start" | "end" | "left" | "right" | "center" | "justify" | "justify-all" | "match-parent",
}> { }
type Modify<T, R> = Omit<T, keyof R> & R;

interface PropsLayout extends Props
{
	width?: string | number,
}
