import { CssStyles, Styles } from "./styles.js";
import { Random } from "./random.js";
import { Scene } from "./scene.js";
import { Language } from "./engine.js";
import { Engine } from "./index.js";

export class Builder
{
	private styles = new Set<Styles>();
	private stylesEl: HTMLStyleElement | null = null;
	private langSync: (() => void)[] = [];
	private dynamics: { c: HTMLElement, v: DynamicValue<any> }[] = [];
	private addedDynamics: { update: () => void, v: DynamicValue<any> }[] = [];

	constructor(private prefix: string, private context: HTMLElement) { }

	public initEl<K extends keyof HTMLElementTagNameMap>(tagName: K, props?: Props, content?: Content)
	{
		const el = document.createElement(tagName);
		if (this.context) this.context.appendChild(el);

		const prevContext = this.context;
		this.context = el;

		if (props)
		{
			if (props.styles)
			{
				let styles: Styles[] = [];
				if (props.styles instanceof Array) styles = props.styles;
				else if (props.styles) styles = [props.styles];

				const newStyles: Styles[] = [];

				for (let i = 0; i < styles.length; i++)
				{
					let style: Styles | undefined = styles[i];

					while (style)
					{
						if (!style.className || (!style.prefix && !style.className.startsWith(this.prefix)))
						{
							style.className = [style.prefix || this.prefix, style.name || tagName, Random.string()].join("_");
						}
						newStyles.push(style);

						style = style.base;
					}
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

		this.context = prevContext;

		return el;
	}

	private appendContent(content: Content, firstRender = true)
	{
		if (typeof content == "number" || typeof content == "string")
		{
			this.context.append(`${content}`);
		}
		else if (typeof content == "function")
		{
			const r = content();
			if (this.dynamics.length != 0)
			{
				if (firstRender)
				{
					let update: (() => void) | null = null;
					this.dynamics.forEach(({ c, v }) =>
					{
						if (c == this.context)
						{
							if (!update) update = this.synced(content);
							this.addedDynamics.push({ update, v });
							v.onChange(update);
						}
					});
				}
				this.dynamics = this.dynamics.filter(v => v.c != this.context);
			}
			if (r) this.appendContent(r);
		}
		else if (content instanceof DynamicValue)
		{
			this.appendContent(() => content.get(this));
		}
		else if (typeof content == "object")
		{
			this.context.appendChild(content);
		}
	}

	public addStyle(style: Styles)
	{
		if (!style.className || (!style.prefix && !style.className.startsWith(this.prefix)))
		{
			style.className = [style.prefix || this.prefix, style.name, Random.string()].join("_");
		}
		this.styles.add(style);
		return style.className;
	}

	public addAllStyles(styles: Styles[] | { [key: string]: Styles } | { [key: string]: { styles: Styles } })
	{
		if (styles instanceof Array)
		{
			styles.forEach(style => this.addStyle(style));
		}
		else
		{
			Object.values(styles).forEach(style =>
			{
				if (style instanceof Styles)
					this.addStyle(style);
				else
					this.addStyle(style.styles);
			});
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

	public _destroy()
	{
		if (this.stylesEl)
		{
			document.head.removeChild(this.stylesEl);
			this.stylesEl = null;
		}
		this.addedDynamics.forEach(({ update, v }) => v.removeOnChange(update));
	}

	public _dynamic(value: DynamicValue<any>)
	{
		this.dynamics.push({ c: this.context, v: value });
	}

	private synced(content: Content)
	{
		const parent = this.context;
		const update = (firstRender = false) =>
		{
			const context = this.context;
			this.context = parent;
			this.context.innerHTML = "";
			this.appendContent(content, firstRender);
			this.context = context;
		}
		return update;
	}

	public syncLang(content: Localization[string])
	{
		return () =>
		{
			const update = this.synced(() => content[Engine.language]);
			update(true);
			this.langSync.push(update);
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

export class SceneBuilder extends Builder
{
	constructor(private scene: Scene)
	{
		super(scene.constructor.name, scene.root);
	}

	public canvas(props?: Props)
	{
		const canvas = document.createElement("canvas");
		const div = this.div({ ...props, css: { ...props?.css, display: "flex" } }, () => canvas);
		this.scene._initCanvas(canvas);
		return div;
	}
}

export class DynamicValue<T>
{
	private listeners: (() => void)[] = [];
	constructor(private value: T) { }

	public get v(): T
	{
		return this.value;
	}

	public set v(v: T)
	{
		this.value = v;
		this.listeners.forEach(f => f());
	}

	public get(builder: Builder): T
	{
		builder._dynamic(this);
		return this.value;
	}

	public onChange(listener: () => void)
	{
		this.listeners.push(listener);
	}

	public removeOnChange(listener: () => void)
	{
		const i = this.listeners.indexOf(listener);
		if (i >= 0) this.listeners.splice(i, 1);
	}
}

type Content = string | number | DynamicValue<Content> | Node | (() => void | Content);
export type Localization = Record<string, Record<Language, Content>>

export interface Props
{
	css?: CssStyles,
	styles?: Styles | Styles[],
	onClick?: (e: MouseEvent) => void,
}

interface PropsLayout extends Props
{
	width?: string | number,
}
