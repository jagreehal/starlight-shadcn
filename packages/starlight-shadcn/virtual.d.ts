declare module 'virtual:starlight-shadcn/config' {
	export const config: {
		collapsibleSidebar: boolean;
		clerkToc: boolean;
		pageActions: {
			enabled: boolean;
			markdownUrl?: string;
		};
		palettes: { value: string; label: string }[];
		navLinks: {
			label: string;
			href: string;
			activeMatch?: string;
			translations?: Record<string, string>;
		}[];
	};
}
