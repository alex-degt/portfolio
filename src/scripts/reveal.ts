export function initReveal(): void {
	const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

	if (!items.length) {
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				const target = entry.target as HTMLElement;
				const delay = target.dataset.delay ?? "0";
				target.style.setProperty("--reveal-delay", `${delay}ms`);
				target.classList.add("is-revealed");
				observer.unobserve(target);
			});
		},
		{
			threshold: 0.15,
			rootMargin: "0px 0px -10% 0px",
		},
	);

	items.forEach((item) => observer.observe(item));
}
