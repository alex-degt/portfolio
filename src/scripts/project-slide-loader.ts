import {
	estimateSlidesPerView,
	getProjectCardFragmentPath,
	getProjectSlideLoadRange,
	getProjectSlideVisibleRange,
} from "../lib/projectsSwiper";
import type Swiper from "swiper";

const loadedIndices = new Set<number>();
const pendingLoads = new Map<number, Promise<void>>();

let syncAbortController: AbortController | null = null;
const idleCallbackIds = new Set<number>();

/** Uses Swiper's cached sizes — no layout thrashing; matches CSS `slidesPerView: auto` widths. */
function getSlidesPerView(swiper: Swiper): number {
	const slideWidth = swiper.slidesSizesGrid[swiper.activeIndex] ?? swiper.slidesSizesGrid[0] ?? 0;

	return estimateSlidesPerView(swiper.width, slideWidth);
}

function isAbortError(error: unknown): boolean {
	return error instanceof DOMException && error.name === "AbortError";
}

function cancelScheduledHydration(): void {
	syncAbortController?.abort();
	syncAbortController = null;

	for (const id of idleCallbackIds) {
		window.cancelIdleCallback(id);
	}

	idleCallbackIds.clear();
}

function scheduleIdleWork(callback: () => void): void {
	if ("requestIdleCallback" in window) {
		const id = window.requestIdleCallback(
			() => {
				idleCallbackIds.delete(id);
				callback();
			},
			{ timeout: 2000 },
		);
		idleCallbackIds.add(id);
		return;
	}

	globalThis.setTimeout(callback, 1);
}

function setSlideBusy(slide: HTMLElement, busy: boolean): void {
	slide.setAttribute("aria-busy", busy ? "true" : "false");
}

function markSlideLoaded(slide: HTMLElement): void {
	slide.dataset.projectLoaded = "true";
	setSlideBusy(slide, false);
}

function renderSkeleton(host: HTMLElement): void {
	const template = document.querySelector<HTMLTemplateElement>(".js-projectCardSkeletonTemplate");

	if (template) {
		host.replaceChildren(template.content.cloneNode(true));
	}
}

function showSlideError(host: HTMLElement, slide: HTMLElement): void {
	host.innerHTML = `<div class="m-1.5 h-full shadow-2xl lg:m-2">
	<div class="project-card-skeleton project-card-skeleton--error" role="alert">
		<p class="project-card-skeleton__message">Could not load this project.</p>
		<button type="button" class="project-card-slide-retry js-projectSlideRetry">Try again</button>
	</div>
</div>`;
	setSlideBusy(slide, false);
}

async function fetchProjectSlideHtml(slug: string, signal?: AbortSignal): Promise<string> {
	const response = await fetch(getProjectCardFragmentPath(slug), { signal });

	if (!response.ok) {
		throw new Error(`Failed to load project card "${slug}": ${response.status}`);
	}

	const html = await response.text();
	const doc = new DOMParser().parseFromString(html, "text/html");
	const fragment = doc.querySelector<HTMLElement>(".js-projectCardFragment");

	if (!fragment) {
		throw new Error(`Project card fragment missing for "${slug}"`);
	}

	return fragment.innerHTML;
}

async function hydrateProjectSlide(
	slide: HTMLElement,
	index: number,
	options: { signal?: AbortSignal } = {},
): Promise<void> {
	if (loadedIndices.has(index) || slide.dataset.projectLoaded === "true") {
		loadedIndices.add(index);
		return;
	}

	const existing = pendingLoads.get(index);

	if (existing) {
		await existing;
		return;
	}

	const slug = slide.dataset.projectSlug;

	if (!slug) {
		return;
	}

	const loadPromise = (async () => {
		const host = slide.querySelector<HTMLElement>(".js-projectSlideHost");

		if (!host) {
			return;
		}

		setSlideBusy(slide, true);

		try {
			host.innerHTML = await fetchProjectSlideHtml(slug, options.signal);
			// Dynamic import keeps Fancybox out of the main bundle; the chunk is
			// shared with the idle-time loader in all-pages.ts.
			const { bindFancybox } = await import("./fancybox");
			bindFancybox(host);
			markSlideLoaded(slide);
			loadedIndices.add(index);
		} catch (error) {
			if (isAbortError(error)) {
				return;
			}

			showSlideError(host, slide);
			throw error;
		}
	})().finally(() => {
		pendingLoads.delete(index);
	});

	pendingLoads.set(index, loadPromise);

	try {
		await loadPromise;
	} catch {
		// Error UI is rendered inside the slide.
	}
}

function queueProjectSlideHydration(slide: HTMLElement, index: number, swiper: Swiper, signal: AbortSignal): void {
	const total = Number(swiper.el.dataset.projectTotal ?? swiper.slides.length);
	const slidesPerView = getSlidesPerView(swiper);
	const visible = getProjectSlideVisibleRange(swiper.activeIndex, slidesPerView, total);
	const isVisible = index >= visible.start && index <= visible.end;

	const run = (): void => {
		if (signal.aborted) {
			return;
		}

		void hydrateProjectSlide(slide, index, { signal });
	};

	if (isVisible) {
		run();
		return;
	}

	scheduleIdleWork(run);
}

export function syncProjectSlides(swiper: Swiper): void {
	cancelScheduledHydration();

	const root = swiper.el;
	const total = Number(root.dataset.projectTotal ?? swiper.slides.length);

	if (!total) {
		return;
	}

	syncAbortController = new AbortController();
	const { signal } = syncAbortController;

	const { start, end } = getProjectSlideLoadRange(swiper.activeIndex, getSlidesPerView(swiper), total);

	for (let index = start; index <= end; index += 1) {
		const slide = swiper.slides[index] as HTMLElement | undefined;

		if (!slide?.classList.contains("swiper-slide")) {
			continue;
		}

		if (slide.dataset.projectLoaded === "true") {
			loadedIndices.add(index);
			continue;
		}

		queueProjectSlideHydration(slide, index, swiper, signal);
	}
}

export function registerInitialProjectSlides(root: HTMLElement): void {
	root.querySelectorAll<HTMLElement>(".swiper-slide[data-project-loaded='true']").forEach((slide) => {
		const index = Number(slide.dataset.projectIndex);

		if (!Number.isNaN(index)) {
			loadedIndices.add(index);
		}

		setSlideBusy(slide, false);
	});

	root.addEventListener("click", (event) => {
		const target = event.target;

		if (!(target instanceof Element)) {
			return;
		}

		const retryButton = target.closest<HTMLButtonElement>(".js-projectSlideRetry");

		if (!retryButton) {
			return;
		}

		const slide = retryButton.closest<HTMLElement>(".swiper-slide");

		if (!slide) {
			return;
		}

		const index = Number(slide.dataset.projectIndex);

		if (Number.isNaN(index) || slide.dataset.projectLoaded === "true") {
			return;
		}

		const host = slide.querySelector<HTMLElement>(".js-projectSlideHost");

		if (!host) {
			return;
		}

		renderSkeleton(host);
		setSlideBusy(slide, true);
		void hydrateProjectSlide(slide, index);
	});
}
