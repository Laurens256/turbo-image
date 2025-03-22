import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import MagicString from 'magic-string';

export default defineConfig({
	plugins: [sveltekit(), tablerSvelteImportOptimizer()],
});

// optimize tabler icons because bad tree shaking
// see https://github.com/tabler/tabler-icons/issues/669#issuecomment-1993756128
export function tablerSvelteImportOptimizer(): Plugin {
	return {
		name: 'tabler-svelte optimizer',
		transform(code, id) {
			const ms = new MagicString(code, { filename: id });
			ms.replace(
				/([ \t]*)import\s+\{([^;]*?)}\s+from\s+['"]@tabler\/icons-svelte['"];?/g,
				(match, whitespace: string, importNames: string) => {
					const hasSemi = match.endsWith(';');
					const imports = importNames
						.split(',')
						.map((v) => v.trim())
						.map((name) => {
							// old: import { IconArrowRightBar } from '@tabler/icons-svelte';
							// new: import IconArrowRightBar from '@tabler/icons-svelte/icons/arrow-right-bar';
							const newName = name.replace(/([A-Z]|[0-9]+)/g, '-$1').toLowerCase().slice(6);
							return `${whitespace}import ${name} from '@tabler/icons-svelte/icons/${newName}'${hasSemi ? ';' : ''}`;
						});
					return imports.join('\n');
				},
			);

			if (ms.hasChanged()) {
				return {
					code: ms.toString(),
					map: ms.generateMap(),
				};
			}
		},
	};
}
