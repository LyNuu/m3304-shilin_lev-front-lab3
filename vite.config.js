import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				catalog: resolve(__dirname, "catalog.html"),
				began: resolve(__dirname, "began.html"),
<<<<<<< HEAD
				notes: resolve(__dirname, "notes.html")
			}
		}
	}
=======
				notes: resolve(__dirname, "notes.html"),
			},
		},
	},
>>>>>>> c8f836ac699269592fe981f5b9283e427a15e263
});
