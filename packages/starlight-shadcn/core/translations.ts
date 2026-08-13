/**
 * UI strings for the controls this theme adds beyond Starlight's own. Every
 * other string in the theme reuses a built-in Starlight key.
 *
 * Only `en` ships: Starlight falls back to English for any key a locale is
 * missing, so a machine-translated set would be worse than the fallback.
 * Consumers translate these the same way they translate Starlight's own
 * strings — see https://starlight.astro.build/guides/i18n/#translate-starlights-ui
 */
export const translations = {
	en: {
		// Upstream's Header has no <nav>, so there is no built-in key to reuse.
		'starlightShadcn.headerNav': 'Site navigation',
		'starlightShadcn.collapseSidebar': 'Collapse sidebar',
		'starlightShadcn.expandSidebar': 'Expand sidebar',
		'starlightShadcn.paletteSelect': 'Select preset palette',
		'starlightShadcn.paletteDefault': 'Default',
		'starlightShadcn.copyMarkdown': 'Copy Markdown',
		'starlightShadcn.copyMarkdownSuccess': 'Markdown copied to clipboard',
		'starlightShadcn.copyMarkdownFailed': 'Copy failed',
		'starlightShadcn.copyMarkdownFailedStatus': 'Could not copy markdown',
		'starlightShadcn.open': 'Open',
		'starlightShadcn.openInGitHub': 'Open in GitHub',
		'starlightShadcn.viewAsMarkdown': 'View as Markdown',
		'starlightShadcn.openInChatGPT': 'Open in ChatGPT',
		'starlightShadcn.openInClaude': 'Open in Claude',
		'starlightShadcn.openInCursor': 'Open in Cursor',
	},
};
