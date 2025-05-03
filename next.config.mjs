/** @type {import('next').NextConfig} */
const config = {
	output: 'export',
	experimental: {
		esmExternals: "loose",
	},
};

export default config;
