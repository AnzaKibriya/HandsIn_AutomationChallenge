import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { composePlugins, withNx } from "@nx/next";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
	// Use this to set Nx-specific options
	// See: https://nx.dev/recipes/next/next-config-setup
	nx: {},
	output: "standalone",
	outputFileTracingRoot: join(__dirname, "../../"),
	outputFileTracingExcludes: {
		"*": [
			"node_modules/@esbuild",
			"node_modules/esbuild",
			"node_modules/webpack",
			"node_modules/sharp",
		],
	},
	poweredByHeader: false,
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{ hostname: "localhost" },
			{ hostname: "127.0.0.1" },
		],
	},
	typescript: {
		tsconfigPath: "tsconfig.app.json",
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	watchOptions: { pollIntervalMs: 1000 },
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
];

export default composePlugins(...plugins)(nextConfig);
