import { getCollection, type CollectionEntry } from "astro:content";

export type SocialLink = CollectionEntry<"socials">["data"];

const socialOrder = ["github", "telegram", "linkedin", "email"] as const;

export async function getSocials(): Promise<SocialLink[]> {
	const entries = await getCollection("socials");
	const byId = new Map(entries.map((entry: CollectionEntry<"socials">) => [entry.id, entry.data]));

	return socialOrder.map((id) => {
		const item = byId.get(id);
		if (!item) throw new Error(`Missing social link: ${id}`);
		return item;
	});
}
