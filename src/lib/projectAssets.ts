import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const publicDir = path.resolve(process.cwd(), "public");

export function projectSlugFromEntryId(entryId: string): { slug: string; isNda: boolean } {
	if (entryId.startsWith("nda/")) {
		const slug = entryId.slice("nda/".length);
		if (!slug) {
			throw new Error(`Invalid project entry id "${entryId}" — expected "nda/slug".`);
		}
		return { slug, isNda: true };
	}

	if (entryId.includes("/")) {
		throw new Error(`Invalid project entry id "${entryId}" — expected "nda/slug" or "slug".`);
	}

	return { slug: entryId, isNda: false };
}

export function imagesPathForProject(slug: string): string {
	return `/img/projects/${slug}/`;
}

export function galleryNameFromSlug(slug: string): string {
	return slug.replace(/-/g, "").toLowerCase();
}

export function listGalleryImageNumbers(slug: string): number[] {
	const dir = path.join(publicDir, "img/projects", slug);
	if (!existsSync(dir)) {
		return [];
	}

	return readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isFile() && /^\d+\.webp$/i.test(entry.name))
		.map((entry) => Number.parseInt(entry.name.replace(/\.webp$/i, ""), 10))
		.filter((num) => Number.isFinite(num))
		.sort((a, b) => a - b);
}

export function resolveProjectLogo(slug: string, explicitLogo?: string): string | undefined {
	if (explicitLogo) {
		return explicitLogo.startsWith("/") ? explicitLogo : `/${explicitLogo}`;
	}

	const candidates = [`img/projects/${slug}/logo.svg`, `img/projects/${slug}.svg`];

	for (const candidate of candidates) {
		if (existsSync(path.join(publicDir, candidate))) {
			return `/${candidate}`;
		}
	}

	return undefined;
}

export function thumbsPathForImagesPath(imagesPath: string): string {
	return `${imagesPath}thumbs/`;
}
