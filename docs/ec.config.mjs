import ecTwoSlash from 'expressive-code-twoslash';
import githubLightHC from '@shikijs/themes/github-light-high-contrast';

/**
 * Expressive Code options live here rather than in `astro.config.mjs` because
 * the `<Code>` component (used by `<Preview>` and `<PackageManagers>`) requires
 * the inline config to be JSON-serializable — and a plugin instance isn't.
 */

/**
 * Syntax themes deliberately mute comments, so even github-light-high-contrast
 * lands at 5.12:1 on our code background — fine for AA, short of AAA's 7:1.
 * Darken just the comment scope to #4b545e (7.06:1); everything else in the
 * high-contrast pair already clears 7:1.
 */
const AAA_COMMENT = '#4b545e';

const lightAaa = {
	...githubLightHC,
	name: 'github-light-high-contrast-aaa',
	tokenColors: githubLightHC.tokenColors.map((token) => {
		const scope = Array.isArray(token.scope) ? token.scope : [token.scope];
		const isComment = scope.some((s) => typeof s === 'string' && s.startsWith('comment'));
		return isComment ? { ...token, settings: { ...token.settings, foreground: AAA_COMMENT } } : token;
	}),
};

export default {
	// First entry is used for dark, second for light (Starlight's convention).
	themes: ['github-dark-high-contrast', lightAaa],
	plugins: [ecTwoSlash()],
};
