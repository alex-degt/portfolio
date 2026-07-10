import Swiper from "swiper";
import { FreeMode, Navigation, Pagination } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";

import { PROJECTS_SWIPER_BUFFER_SLIDES } from "../lib/projectsSwiper";
import { registerInitialProjectSlides, syncProjectSlides } from "./project-slide-loader";

/** Desktop-only free-scroll; matches CSS `min-width: 992px` slide layout. */
const DESKTOP_MIN_WIDTH = 992;

// Typed via the module-augmented `SwiperOptions` (from `swiper/types`): the
// `breakpoints` field itself references the base options interface, which does
// not include module options like `freeMode`.
const desktopBreakpointOptions: SwiperOptions = {
	speed: 360,
	threshold: 2,
	resistanceRatio: 0.75,
	freeMode: {
		enabled: true,
		sticky: true,
		momentumRatio: 0.85,
		momentumVelocityRatio: 0.85,
		momentumBounceRatio: 0.8,
	},
};

export function initSwiper(): void {
	const projectsRoot = document.querySelector<HTMLElement>(".js-projectsSwiper");

	if (!projectsRoot) {
		return;
	}

	registerInitialProjectSlides(projectsRoot);

	new Swiper(projectsRoot, {
		modules: [FreeMode, Navigation, Pagination],
		// Slide widths come from CSS (`.projects-swiper .swiper-slide`); see `_projects-swiper.scss`.
		slidesPerView: "auto",
		lazyPreloadPrevNext: PROJECTS_SWIPER_BUFFER_SLIDES,
		touchStartPreventDefault: false,
		// Mobile / tablet: Swiper defaults (snap, no freeMode).
		freeMode: false,
		navigation: {
			prevEl: ".js-projectsSwiperPrev",
			nextEl: ".js-projectsSwiperNext",
		},
		pagination: {
			el: ".js-projectsSwiperPagination",
			type: "fraction",
		},
		breakpoints: {
			[DESKTOP_MIN_WIDTH]: desktopBreakpointOptions,
		},
		on: {
			init(swiperInstance) {
				syncProjectSlides(swiperInstance);
			},
			slideChange(swiperInstance) {
				syncProjectSlides(swiperInstance);
			},
			resize(swiperInstance) {
				syncProjectSlides(swiperInstance);
			},
		},
	});
}
