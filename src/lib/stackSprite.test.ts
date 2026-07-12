import { describe, expect, it } from "vitest";
import { buildStackSpriteMarkup, namespaceSvgIds, svgToSymbol, symbolIdFromIconPath } from "./stackSprite";

describe("symbolIdFromIconPath", () => {
	it("uses the logo filename without extension", () => {
		expect(symbolIdFromIconPath("/img/icons/logo-react.svg")).toBe("logo-react");
	});
});

describe("namespaceSvgIds", () => {
	it("prefixes ids and url(#…) references without truncating longer ids", () => {
		const input = `<defs><linearGradient id="a"/><linearGradient id="ab"/></defs><path fill="url(#a)"/><path fill="url(#ab)"/>`;
		expect(namespaceSvgIds(input, "logo-vite")).toBe(
			`<defs><linearGradient id="logo-vite__a"/><linearGradient id="logo-vite__ab"/></defs><path fill="url(#logo-vite__a)"/><path fill="url(#logo-vite__ab)"/>`,
		);
	});
});

describe("svgToSymbol", () => {
	it("wraps inner markup in a symbol and keeps root fill", () => {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>`;
		expect(svgToSymbol(svg, "logo-notebooklm")).toBe(
			`<symbol id="logo-notebooklm" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0z"/></symbol>`,
		);
	});
});

describe("buildStackSpriteMarkup", () => {
	it("includes a symbol for every public logo-*.svg", () => {
		const sprite = buildStackSpriteMarkup();
		expect(sprite).toContain('id="logo-react"');
		expect(sprite).toContain('id="logo-javascript"');
		expect(sprite).toContain("url(#logo-python__a)");
		expect(sprite).not.toContain('id="a"');
	});
});
