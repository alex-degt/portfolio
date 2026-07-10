import type { CollectionEntry } from "astro:content";
import {
	galleryNameFromSlug,
	imagesPathForProject,
	listGalleryImageNumbers,
	projectSlugFromEntryId,
	resolveProjectLogo,
} from "./projectAssets";

export type ProjectFrontmatter = CollectionEntry<"projects">["data"];
export type ProjectStatus = NonNullable<ProjectFrontmatter["status"]>;

export type Project = ProjectFrontmatter & {
	slug: string;
	isNda: boolean;
	galleryName: string;
	galleryImageNumbers: number[];
	imagesPath?: string;
	resolvedLogo?: string;
};

export function projectsFromEntries(entries: CollectionEntry<"projects">[]): Project[] {
	return [...entries].sort((a, b) => a.data.order - b.data.order).map(enrichProject);
}

function enrichProject(entry: CollectionEntry<"projects">): Project {
	const { slug, isNda } = projectSlugFromEntryId(entry.id);
	const galleryImageNumbers = isNda ? [] : listGalleryImageNumbers(slug);
	const hasGallery = galleryImageNumbers.length > 0;
	const imagesPath = hasGallery ? imagesPathForProject(slug) : undefined;

	const resolvedLogo = hasGallery ? undefined : resolveProjectLogo(slug, entry.data.logo);

	return {
		...entry.data,
		slug,
		isNda,
		galleryName: galleryNameFromSlug(slug),
		galleryImageNumbers,
		imagesPath,
		resolvedLogo,
	};
}
