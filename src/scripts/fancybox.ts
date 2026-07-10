import { Fancybox, type FancyboxOptions } from "@fancyapps/ui/dist/fancybox/fancybox.js";
// Side-effect type imports: load the Carousel plugin module augmentations
// (`Arrows`, `Toolbar`, `Thumbs`) so `FancyboxOptions.Carousel` typechecks.
import type {} from "@fancyapps/ui/dist/carousel/carousel.arrows.js";
import type {} from "@fancyapps/ui/dist/carousel/carousel.thumbs.js";
import type {} from "@fancyapps/ui/dist/carousel/carousel.toolbar.js";
import fancyboxStylesHref from "../styles/fancybox.css?url";

let fancyboxStylesPromise: Promise<void> | null = null;

function ensureFancyboxStyles(): Promise<void> {
	if (typeof document === "undefined") {
		return Promise.resolve();
	}

	if (document.querySelector(`link[data-fancybox-styles][href="${fancyboxStylesHref}"]`)) {
		return Promise.resolve();
	}

	if (fancyboxStylesPromise) {
		return fancyboxStylesPromise;
	}

	fancyboxStylesPromise = new Promise((resolve, reject) => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = fancyboxStylesHref;
		link.dataset.fancyboxStyles = "true";
		link.onload = () => resolve();
		link.onerror = () => reject(new Error("Failed to load Fancybox styles."));
		document.head.append(link);
	});

	return fancyboxStylesPromise;
}

const fancyboxOptions: Partial<FancyboxOptions> = {
	placeFocusBack: false,
	Carousel: {
		infinite: false,
		Arrows: false,
		Toolbar: {
			display: {
				left: ["counter"],
				middle: [],
				right: ["close"],
			},
		},
		Thumbs: false,
		breakpoints: {
			"(min-width: 1024px)": {
				Arrows: {
					prevTpl: `
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20">
							<path fill="currentColor" d="M.75 10 6 4.5V8h13v4H6v3.5L.75 10z"></path>
						</svg>
					`,
					nextTpl: `
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">
							<path fill="currentColor" d="m30.8 16-8.4 8.8v-5.6H1.6v-6.4h20.8V7.2l8.4 8.8Z"></path>
						</svg>
					`,
				},
			},
		},
	},
};

export function bindFancybox(root: ParentNode = document): void {
	void ensureFancyboxStyles();

	if (root instanceof Document) {
		Fancybox.bind("[data-fancybox]", fancyboxOptions);
		return;
	}

	if (root instanceof HTMLElement) {
		Fancybox.bind(root, "[data-fancybox]", fancyboxOptions);
	}
}

export async function initFancybox(): Promise<void> {
	await ensureFancyboxStyles();
	bindFancybox(document);
}
