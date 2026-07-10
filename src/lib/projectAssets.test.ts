import { describe, expect, it } from "vitest";
import {
	galleryNameFromSlug,
	imagesPathForProject,
	projectSlugFromEntryId,
	resolveProjectLogo,
	thumbsPathForImagesPath,
} from "./projectAssets";

describe("projectSlugFromEntryId", () => {
	it("parses a plain project id", () => {
		expect(projectSlugFromEntryId("slk")).toEqual({ slug: "slk", isNda: false });
	});

	it("parses an NDA project id", () => {
		expect(projectSlugFromEntryId("nda/d-1")).toEqual({ slug: "d-1", isNda: true });
	});

	it("rejects an empty NDA slug", () => {
		expect(() => projectSlugFromEntryId("nda/")).toThrow(/expected "nda\/slug"/);
	});

	it("rejects unexpected nesting", () => {
		expect(() => projectSlugFromEntryId("foo/bar")).toThrow(/expected "nda\/slug" or "slug"/);
	});
});

describe("imagesPathForProject", () => {
	it("returns a root-relative directory path", () => {
		expect(imagesPathForProject("slk")).toBe("/img/projects/slk/");
	});
});

describe("thumbsPathForImagesPath", () => {
	it("appends the thumbs directory", () => {
		expect(thumbsPathForImagesPath("/img/projects/slk/")).toBe("/img/projects/slk/thumbs/");
	});
});

describe("galleryNameFromSlug", () => {
	it("strips dashes and lowercases", () => {
		expect(galleryNameFromSlug("Master-Step-Luxury")).toBe("masterstepluxury");
	});
});

describe("resolveProjectLogo", () => {
	it("normalizes an explicit logo to a root-relative URL", () => {
		expect(resolveProjectLogo("any", "img/projects/nda/domio.webp")).toBe("/img/projects/nda/domio.webp");
		expect(resolveProjectLogo("any", "/img/projects/nda/domio.webp")).toBe("/img/projects/nda/domio.webp");
	});

	it("finds an existing per-project logo file in public/", () => {
		expect(resolveProjectLogo("calligaris")).toBe("/img/projects/calligaris/logo.svg");
	});

	it("returns undefined when nothing matches", () => {
		expect(resolveProjectLogo("does-not-exist")).toBeUndefined();
	});
});
