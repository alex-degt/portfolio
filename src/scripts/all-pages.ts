import "swiper/css";

import { initNetworkLinks } from "./network-links";
import { initReveal } from "./reveal";
import { initSwiper } from "./swiper";

function initFancyboxWhenIdle(): void {
	const loadFancybox = () => {
		void import("./fancybox")
			.then(({ initFancybox }) => initFancybox())
			.catch((error) => {
				console.error("Failed to initialize Fancybox", error);
			});
	};

	if ("requestIdleCallback" in window) {
		window.requestIdleCallback(() => loadFancybox(), { timeout: 2000 });
		return;
	}

	globalThis.setTimeout(loadFancybox, 300);
}

const initAllPages = (): void => {
	initReveal();
	initNetworkLinks();
	initSwiper();

	if (document.readyState === "complete") {
		initFancyboxWhenIdle();
		return;
	}

	window.addEventListener("load", initFancyboxWhenIdle, { once: true });
};

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initAllPages, { once: true });
} else {
	initAllPages();
}
