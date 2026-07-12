import { getEntry } from "astro:content";
import { getContacts, sameAsFromContacts } from "./contacts";

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
	const [entry, contacts] = await Promise.all([getEntry("site", "config"), getContacts()]);
	if (!entry) throw new Error('Missing site config entry (expected id "config" in content/site.yaml)');

	const { keywords, author, ...rest } = entry.data;
	return {
		...rest,
		author: {
			...author,
			email: contacts.email,
			sameAs: sameAsFromContacts(contacts),
		},
		keywords: keywords.join(", "),
	};
}
