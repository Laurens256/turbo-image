<script lang="ts">
	import { Dialog } from '$components';
	import { IconChevronDown } from '@tabler/icons-svelte';
	import { supportedFormatsStore } from '$stores';
	import { mimeUtil } from '$utils';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
	};

	let { isOpen, onClose }: Props = $props();

	type AccordionProps = {
		title: string;
		content: string;
	};

	const supportedImageFormatExtensions = $derived(supportedFormatsStore.imageInputs
		.map((mime) => mimeUtil.getImageExtensionByMimetype(mime))
		.filter((mime) => mime !== undefined));
</script>

<Dialog title="About TurboImage" onClose={onClose} isOpen={isOpen}>
	<p class="description">
		TurboImage is a <i>client-side</i> image converter.
		This means that none of the files you upload are sent to a server.
		All processing is done on and by your device.
	</p>

	<div class="accordionContainer">
		{#snippet accordion({ title, content }: AccordionProps)}
			<details class="details">
				<summary class="summary" tabindex="0">
					{title}
					<IconChevronDown size={24} class="chevron" />
				</summary>
				<div class="detailsInner">
					{#if typeof content === 'string'}
						<p>{content}</p>
					{/if}
				</div>
			</details>
		{/snippet}

		{@render accordion({
			title: 'What image formats can I upload?',
			content: `Your browser supports the following image formats: ${supportedImageFormatExtensions.join(', ')}`,
		})}

		{@render accordion({
			title: 'How does it work?',
			content: `TurboImage uses the Canvas API to convert images.
			This means that the supported image formats are limited to those supported by the browser.`,
		})}
	</div>
</Dialog>

<style>
	.description {
		font-size: 0.9rem;
	}

	.accordionContainer {
		margin-top: 1rem;
	}

	.details {
		--padding-inline: 0.75rem;
		--outer-radius: 0.3rem;

		.summary {
			cursor: pointer;
			background-color: var(--background-button);
			padding: 0.4rem var(--padding-inline);
			transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
			border: 1px solid transparent;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&:hover, &:focus-visible {
				background-color: var(--background-button-hover);
				border-color: var(--highlight-button);
			}

			&::marker {
				content: none;
			}
			& :global(.chevron) {
				transition: rotate 0.15s ease;
			}
		}
		&[open] .summary :global(.chevron) {
			rotate: 180deg;
		}
		&:first-of-type .summary {
			border-top-left-radius: var(--outer-radius);
			border-top-right-radius: var(--outer-radius);
		}
		&:last-of-type .summary {
			border-bottom-left-radius: var(--outer-radius);
			border-bottom-right-radius: var(--outer-radius);
		}

		& .detailsInner {
			padding: 0.25rem var(--padding-inline) 1rem;
			font-size: 0.85rem;
		}
	}
</style>
