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
