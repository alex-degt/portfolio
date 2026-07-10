import { getEntry } from "astro:content";

export type SiteConfig = {
	siteUrl: string;
	siteName: string;
	defaultTitle: string;
	defaultDescription: string;
	ogImagePath: string;
	author: {
		name: string;
		email: string;
		jobTitle: string;
		sameAs: string[];
	};
	keywords: string;
};

export async function getSiteConfig(): Promise<SiteConfig> {
	const entry = await getEntry("site", "config");
	if (!entry) throw new Error('Missing site config entry (expected id "config" in content/site.yaml)');

	const { keywords, ...rest } = entry.data;
	return {
		...rest,
		keywords: keywords.join(", "),
	};
}
