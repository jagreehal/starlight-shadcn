import type { StarlightPlugin } from '@astrojs/starlight/types';
import type { AstroIntegration, ViteUserConfig } from 'astro';
import { override, ALL_COMPONENT_OVERRIDES } from './config/override';
import {
	StarlightShadcnConfigSchema,
	type StarlightShadcnConfig,
	type StarlightShadcnUserConfig,
} from './config/schemas';
import { translations } from './translations';

const parseConfig = (userConfig?: StarlightShadcnUserConfig): StarlightShadcnConfig => {
	const parsedConfig = StarlightShadcnConfigSchema.safeParse(userConfig ?? {});

	if (!parsedConfig.success) {
		throw new Error(
			`Invalid starlight-shadcn plugin configuration.\n${parsedConfig.error.issues.map((issue) => issue.message).join('\n')}`,
		);
	}

	return parsedConfig.data;
};

const VIRTUAL_MODULE_ID = 'virtual:starlight-shadcn/config';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

function viteConfigModule(pluginConfig: StarlightShadcnConfig) {
	const payload = {
		collapsibleSidebar: pluginConfig.collapsibleSidebar,
		clerkToc: pluginConfig.clerkToc,
		pageActions: pluginConfig.pageActions,
		palettes: pluginConfig.palettes,
		navLinks: pluginConfig.navLinks,
	};

	return {
		name: 'vite-plugin-starlight-shadcn-config',
		resolveId(id: string) {
			return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : null;
		},
		load(id: string) {
			if (id !== RESOLVED_VIRTUAL_MODULE_ID) return null;
			return `export const config = ${JSON.stringify(payload)};`;
		},
	} satisfies NonNullable<ViteUserConfig['plugins']>[number];
}

function createIntegration(pluginConfig: StarlightShadcnConfig): AstroIntegration {
	return {
		name: 'starlight-shadcn-integration',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [viteConfigModule(pluginConfig)],
					},
				});
			},
		},
	};
}

const plugin = (userConfig: StarlightShadcnUserConfig = {}): StarlightPlugin =>
	({
		name: 'starlight-shadcn',
		hooks: {
			'i18n:setup': async ({ injectTranslations }) => {
				injectTranslations(translations);
			},
			'config:setup': ({ config, logger, updateConfig, addIntegration }) => {
				const pluginConfig = parseConfig(userConfig);
				const overrides = userConfig.overrides ?? ALL_COMPONENT_OVERRIDES;

				addIntegration(createIntegration(pluginConfig));

				// Code blocks are rendered by Expressive Code, which sits outside the
				// component overrides — without this its frame keeps EC's own border and
				// radius and reads as foreign next to shadcn surfaces. User config still
				// wins, so themes and any explicit overrides are left alone.
				const userExpressiveCode =
					!config.expressiveCode || config.expressiveCode === true ? {} : config.expressiveCode;

				updateConfig({
					components: override(config, pluginConfig, overrides, logger),
					expressiveCode:
						config.expressiveCode === false
							? false
							: {
									// High-contrast syntax themes: the stock github-light/dark
									// pair bottoms out near 6:1, short of WCAG AAA's 7:1.
									// Listed before the spread so user config still wins.
									themes: ['github-dark-high-contrast', 'github-light-high-contrast'],
									...userExpressiveCode,
									styleOverrides: {
										borderColor: 'var(--border)',
										borderRadius: 'calc(var(--radius) - 2px)',
										codeBackground: 'var(--muted)',
										...userExpressiveCode.styleOverrides,
										frames: {
											editorActiveTabIndicatorTopColor: 'unset',
											editorActiveTabIndicatorBottomColor: 'var(--primary)',
											editorTabBarBorderBottomColor: 'var(--border)',
											editorTabBarBackground: 'var(--background)',
											editorBackground: 'var(--muted)',
											terminalBackground: 'var(--muted)',
											terminalTitlebarBackground: 'var(--background)',
											terminalTitlebarBorderBottomColor: 'var(--border)',
											frameBoxShadowCssValue: 'unset',
											...userExpressiveCode.styleOverrides?.frames,
										},
									},
								},
					customCss: [
						...(config.customCss ?? []),
						// Geist via Fontsource CSS — Astro's Font API breaks React island
						// prerender (CLIENT_ENTRY missing) when injected from a nested
						// integration, so we ship faces as plain stylesheets instead.
						...(pluginConfig.fonts ? ['starlight-shadcn/styles/fonts'] : []),
						'starlight-shadcn/styles/layers',
						'starlight-shadcn/styles/theme',
						'starlight-shadcn/styles/base',
						'starlight-shadcn/styles/components',
					],
				});
			},
		},
	}) satisfies StarlightPlugin;

export { plugin };
