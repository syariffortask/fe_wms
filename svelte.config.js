import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		output:{
			bundleStrategy: 'single'
		},
		adapter: adapter({
			fallback: 'index.html',
		}),
		prerender: {
			entries: [],
		}
	}
};

export default config;
