import { getCollection, type CollectionEntry } from "astro:content";

export type StackItem = CollectionEntry<"stack">["data"] & { id: string };

export async function getStackItems(): Promise<Record<string, StackItem>> {
	const entries = await getCollection("stack");
	return Object.fromEntries(
		entries.map((entry: CollectionEntry<"stack">) => [entry.id, { id: entry.id, ...entry.data }]),
	);
}
