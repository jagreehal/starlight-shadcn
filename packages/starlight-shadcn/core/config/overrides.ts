import type { HookParameters } from '@astrojs/starlight/types';

type StarlightUserConfig = HookParameters<'config:setup'>['config'];
type ComponentOverride = keyof NonNullable<StarlightUserConfig['components']>;

/** Every overridable Starlight component — see @astrojs/starlight/schemas/components.ts */
export const ALL_COMPONENT_OVERRIDES = [
	'Head',
	'ThemeProvider',
	'SkipLink',
	'PageFrame',
	'MobileMenuToggle',
	'TwoColumnContent',
	'Header',
	'SiteTitle',
	'Search',
	'SocialIcons',
	'ThemeSelect',
	'LanguageSelect',
	'Sidebar',
	'MobileMenuFooter',
	'PageSidebar',
	'TableOfContents',
	'MobileTableOfContents',
	'Banner',
	'ContentPanel',
	'PageTitle',
	'FallbackContentNotice',
	'DraftContentNotice',
	'Hero',
	'MarkdownContent',
	'Footer',
	'LastUpdated',
	'Pagination',
	'EditLink',
] as const satisfies readonly ComponentOverride[];

export type ShadcnComponentOverride = (typeof ALL_COMPONENT_OVERRIDES)[number];
