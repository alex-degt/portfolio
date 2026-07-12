import { getCollection, type CollectionEntry } from "astro:content";
import { contactHref, contactIds, getContacts } from "./contacts";

export type SocialLink = CollectionEntry<"socials">["data"] & { href: string };

export async function getSocials(): Promise<SocialLink[]> {
	const [entries, contacts] = await Promise.all([getCollection("socials"), getContacts()]);
	const byId = new Map(entries.map((entry: CollectionEntry<"socials">) => [entry.id, entry.data]));

	return contactIds.map((id) => {
		const item = byId.get(id);
		if (!item) throw new Error(`Missing social link: ${id}`);
		return {
			...item,
			href: contactHref(contacts, id),
		};
	});
}
