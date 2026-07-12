/** Widest CSS layout (`slidesPerView` ≈ 3). Used for SSR initial hydrate + eager images. */
export const PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW = 3;

/** Extra slides to hydrate before/after the visible window. */
export const PROJECTS_SWIPER_BUFFER_SLIDES = 2;

/**
 * Derive fractional slides-per-view from measured sizes (matches CSS `width: calc(100% / N)`).
 * Falls back to the desktop max when sizes are not ready yet.
 */
export function estimateSlidesPerView(
	containerWidth: number,
	slideWidth: number,
	fallback: number = PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW,
): number {
	if (!(containerWidth > 0) || !(slideWidth > 0)) {
		return fallback;
	}

	return containerWidth / slideWidth;
}

export function getProjectSlideVisibleRange(
	activeIndex: number,
	slidesPerView: number,
	totalSlides: number,
): { start: number; end: number } {
	const start = Math.max(0, Math.floor(activeIndex));
	const end = Math.min(totalSlides - 1, Math.ceil(activeIndex + slidesPerView) - 1);

	return { start, end };
}

export function getProjectSlideLoadRange(
	activeIndex: number,
	slidesPerView: number,
	totalSlides: number,
): { start: number; end: number } {
	const start = Math.max(0, Math.floor(activeIndex) - PROJECTS_SWIPER_BUFFER_SLIDES);
	const end = Math.min(totalSlides - 1, Math.ceil(activeIndex + slidesPerView) - 1 + PROJECTS_SWIPER_BUFFER_SLIDES);

	return { start, end };
}

export function getInitialProjectSlideLoadCount(totalSlides: number): number {
	const { end } = getProjectSlideLoadRange(0, PROJECTS_SWIPER_MAX_SLIDES_PER_VIEW, totalSlides);

	return end + 1;
}

export function getProjectCardFragmentPath(slug: string): string {
	return `/project-cards/${slug}/`;
}
