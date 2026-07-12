import { getEntry } from "astro:content";

export const profileIds = ["github", "telegram", "linkedin"] as const;
export const contactIds = [...profileIds, "email"] as const;

export type ProfileId = (typeof profileIds)[number];
export type ContactId = (typeof contactIds)[number];

export type Contacts = {
	email: string;
	github: string;
	telegram: string;
	linkedin: string;
};

export async function getContacts(): Promise<Contacts> {
	const entry = await getEntry("contacts", "config");
	if (!entry) {
		throw new Error('Missing contacts entry (expected id "config" in content/contacts.yaml)');
	}
	return entry.data;
}

export function contactHref(contacts: Contacts, id: ContactId): string {
	if (id === "email") return `mailto:${contacts.email}`;
	return contacts[id];
}

export function sameAsFromContacts(contacts: Contacts): string[] {
	return profileIds.map((id) => contacts[id]);
}
