import type { HookParameters } from '@astrojs/starlight/types';
import type { AstroIntegrationLogger } from 'astro';
import type { StarlightShadcnConfig } from './schemas';
import { ALL_COMPONENT_OVERRIDES, type ShadcnComponentOverride } from './overrides';

type StarlightUserConfig = HookParameters<'config:setup'>['config'];

export function override(
	starlightConfig: StarlightUserConfig,
	pluginConfig: StarlightShadcnConfig,
	overrides: readonly ShadcnComponentOverride[],
	logger: AstroIntegrationLogger,
): StarlightUserConfig['components'] {
	const components = { ...starlightConfig.components };

	for (const name of overrides) {
		if (starlightConfig.components?.[name] != null) {
			const fallback = `starlight-shadcn/components/overrides/${name}.astro`;

			if (pluginConfig.warnOverrides) {
				logger.warn(
					`A \`${name}\` component override is already defined in your Starlight configuration.`,
				);
				logger.warn(
					`To use starlight-shadcn, remove that override or manually render content from \`${fallback}\`.`,
				);
			}
			continue;
		}

		components[name] = `starlight-shadcn/components/overrides/${name}.astro`;
	}

	return components;
}

export { ALL_COMPONENT_OVERRIDES };
