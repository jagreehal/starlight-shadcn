import { z } from 'astro/zod';

export const heroActionVariantSchema = z
	.enum([
		'default',
		'link',
		'secondary',
		'outline',
		'ghost',
		'destructive',
		'primary',
		'minimal',
	])
	.default('default');

export const ExtendDocsSchema = z.object({
	hero: z
		.object({
			announcement: z
				.object({
					text: z.string(),
					link: z.string(),
				})
				.optional()
				.describe('Pill link rendered above the hero title, e.g. a release note.'),
			actions: z
				.array(
					z.object({
						variant: heroActionVariantSchema,
					}),
				)
				.default([]),
		})
		.optional(),
});
