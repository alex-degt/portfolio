import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { fileURLToPath } from "node:url";

const contentDir = fileURLToPath(new URL("./content", import.meta.url));
const projectsContentDir = fileURLToPath(new URL("./content/projects", import.meta.url));

const projectStatus = z.literal("closed");

const projects = defineCollection({
	loader: glob({ base: projectsContentDir, pattern: "**/*.md" }),
	schema: z.object({
		order: z.number().int().positive(),
		cardClasses: z.string().optional(),
		name: z.string().optional(),
		url: z.url().optional(),
		urlText: z.string().optional(),
		logo: z.string().optional(),
		status: projectStatus.optional(),
		stack: z.array(z.string()),
	}),
});

const stack = defineCollection({
	loader: file(`${contentDir}/stack.yaml`),
	schema: z.object({
		name: z.string(),
		icon: z.string(),
		link: z.url(),
	}),
});

const socials = defineCollection({
	loader: file(`${contentDir}/socials.yaml`),
	schema: z.object({
		id: z.string(),
		label: z.string(),
		svg: z.string(),
	}),
});

const contacts = defineCollection({
	loader: file(`${contentDir}/contacts.yaml`),
	schema: z.object({
		email: z.email(),
		github: z.url(),
		telegram: z.url(),
		linkedin: z.url(),
	}),
});

const site = defineCollection({
	loader: file(`${contentDir}/site.yaml`),
	schema: z.object({
		siteUrl: z.url(),
		siteName: z.string(),
		defaultTitle: z.string(),
		defaultDescription: z.string(),
		ogImagePath: z.string(),
		author: z.object({
			name: z.string(),
			jobTitle: z.string(),
		}),
		keywords: z.array(z.string()).min(1),
	}),
});

export const collections = {
	projects,
	stack,
	socials,
	contacts,
	site,
};
