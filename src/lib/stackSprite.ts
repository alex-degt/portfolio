import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const iconsDir = path.resolve(process.cwd(), "public/img/icons");
const LOGO_FILE = /^logo-.+\.svg$/i;

export function symbolIdFromIconPath(iconPath: string): string {
	return path.basename(iconPath, path.extname(iconPath));
}

function attrValue(openTag: string, name: string): string | undefined {
	const match = openTag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, "i"));
	return match?.[1];
}

/** Prefix local ids so gradients/clipPaths don't collide across symbols. */
export function namespaceSvgIds(content: string, prefix: string): string {
	const ids = [...content.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
	const unique = [...new Set(ids)].sort((a, b) => b.length - a.length);

	let result = content;
	for (const id of unique) {
		const namespaced = `${prefix}__${id}`;
		result = result
			.replaceAll(`id="${id}"`, `id="${namespaced}"`)
			.replaceAll(`id='${id}'`, `id='${namespaced}'`)
			.replaceAll(`url(#${id})`, `url(#${namespaced})`)
			.replaceAll(`href="#${id}"`, `href="#${namespaced}"`)
			.replaceAll(`xlink:href="#${id}"`, `xlink:href="#${namespaced}"`);
	}
	return result;
}

export function svgToSymbol(svgSource: string, symbolId: string): string {
	const svg = svgSource.trim();
	const openTagMatch = svg.match(/^<svg\b[^>]*>/i);
	if (!openTagMatch) {
		throw new Error(`Invalid SVG for symbol "${symbolId}"`);
	}

	const openTag = openTagMatch[0];
	const viewBox = attrValue(openTag, "viewBox") ?? "0 0 32 32";
	const fill = attrValue(openTag, "fill");
	const preserveAspectRatio = attrValue(openTag, "preserveAspectRatio");

	let inner = svg.slice(openTag.length).replace(/<\/svg>\s*$/i, "");
	inner = namespaceSvgIds(inner, symbolId);

	const attrs = [
		`id="${symbolId}"`,
		`viewBox="${viewBox}"`,
		fill ? `fill="${fill}"` : null,
		preserveAspectRatio ? `preserveAspectRatio="${preserveAspectRatio}"` : null,
	]
		.filter(Boolean)
		.join(" ");

	return `<symbol ${attrs}>${inner}</symbol>`;
}

export function buildStackSpriteMarkup(dir = iconsDir): string {
	const files = readdirSync(dir)
		.filter((name) => LOGO_FILE.test(name))
		.sort((a, b) => a.localeCompare(b));

	const symbols = files.map((name) => {
		const symbolId = name.replace(/\.svg$/i, "");
		const source = readFileSync(path.join(dir, name), "utf8");
		return svgToSymbol(source, symbolId);
	});

	return [
		'<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true" focusable="false"',
		' style="position:absolute;width:0;height:0;overflow:hidden">',
		...symbols,
		"</svg>",
	].join("");
}
