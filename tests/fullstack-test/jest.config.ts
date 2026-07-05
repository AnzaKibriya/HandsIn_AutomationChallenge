import type { Config } from "jest";

export default {
	displayName: "weather",
	coverageDirectory: "../../coverage/tests/nextjs-weather",
	preset: "../../jest.preset.js",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
} satisfies Config;
