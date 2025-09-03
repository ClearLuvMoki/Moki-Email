import { defineConfig } from "@rsbuild/core";
import { join } from "path";
import { rootPath, srcPath } from "./paths";

const CommonConfig = defineConfig({
	resolve: {
		alias: {
			"@/src": join(rootPath, "./src/"),
			"@/main": join(srcPath, "./main/"),
			"@/render": join(srcPath, "./render/"),
			"@/components": join(srcPath, "./render/components/"),
			"@/domains": join(srcPath, "./domains/"),
		},
	},
	source: {
		decorators: {
			version: "legacy",
		},
	},
});

export default CommonConfig;
