import { describe, expect, it } from "vitest";
import {
	estimateSlidesPerView,
	getInitialProjectSlideLoadCount,
	getProjectCardFragmentPath,
	getProjectSlideLoadRange,
	getProjectSlideVisibleRange,
	PROJECTS_SWIPER_BUFFER_SLIDES,
	PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW,
} from "./projectsSwiper";

describe("estimateSlidesPerView", () => {
	it("matches CSS calc(100% / N) layouts", () => {
		expect(estimateSlidesPerView(1200, 1200 / 3)).toBeCloseTo(3);
		expect(estimateSlidesPerView(375, 375 / 1.2)).toBeCloseTo(1.2);
		expect(estimateSlidesPerView(550, 550 / 1.6)).toBeCloseTo(1.6);
	});

	it("falls back when sizes are not ready", () => {
		expect(estimateSlidesPerView(0, 400)).toBe(PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW);
		expect(estimateSlidesPerView(800, 0)).toBe(PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW);
		expect(estimateSlidesPerView(0, 0, 2)).toBe(2);
	});
});

describe("getProjectSlideVisibleRange", () => {
	it("returns the visible window for whole slidesPerView", () => {
		expect(getProjectSlideVisibleRange(0, 3, 30)).toEqual({ start: 0, end: 2 });
		expect(getProjectSlideVisibleRange(5, 3, 30)).toEqual({ start: 5, end: 7 });
	});

	it("rounds fractional slidesPerView outward", () => {
		expect(getProjectSlideVisibleRange(2, 1.6, 30)).toEqual({ start: 2, end: 3 });
	});

	it("clamps to the last slide", () => {
		expect(getProjectSlideVisibleRange(28, 3, 30)).toEqual({ start: 28, end: 29 });
	});
});

describe("getProjectSlideLoadRange", () => {
	it("extends the visible window by the buffer on both sides", () => {
		expect(getProjectSlideLoadRange(5, 3, 30)).toEqual({
			start: 5 - PROJECTS_SWIPER_BUFFER_SLIDES,
			end: 7 + PROJECTS_SWIPER_BUFFER_SLIDES,
		});
	});

	it("clamps the buffer at collection edges", () => {
		expect(getProjectSlideLoadRange(0, 3, 30).start).toBe(0);
		expect(getProjectSlideLoadRange(29, 3, 30).end).toBe(29);
	});
});

describe("getInitialProjectSlideLoadCount", () => {
	it("covers the first view plus the buffer", () => {
		expect(getInitialProjectSlideLoadCount(30)).toBe(
			PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW + PROJECTS_SWIPER_BUFFER_SLIDES,
		);
	});

	it("never exceeds the total slide count", () => {
		expect(getInitialProjectSlideLoadCount(2)).toBe(2);
	});
});

describe("getProjectCardFragmentPath", () => {
	it("builds a slug-based fragment URL", () => {
		expect(getProjectCardFragmentPath("slk-amp")).toBe("/project-cards/slk-amp/");
	});
});
