export function initNetworkLinks(): void {
	document.querySelectorAll<HTMLElement>(".js-network").forEach((el) => {
		el.addEventListener("mouseleave", () => {
			el.classList.add("is-animating");
			el.addEventListener(
				"animationend",
				() => {
					el.classList.remove("is-animating");
				},
				{ once: true },
			);
		});
	});
}
