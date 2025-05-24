const nextConfig = {
	// Next.js will ignore ESLint errors during builds.
	eslint: {
		ignoreDuringBuilds: true,
	},

	images: {
		remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_API_URL}/documents/**/file`)],
	},

	// (Optional) You can add other global settings here
	// For example, enable React Strict Mode
	reactStrictMode: true,

	// You can also define custom webpack behavior here if needed
};

module.exports = nextConfig;
