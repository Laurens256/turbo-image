<script lang="ts">
	import type { ImageExt } from '$types';
	import { focusTrap } from '$actions';
	import { supportedFormatsStore } from '$stores';

	type Props = {
		onChange: (ext: ImageExt) => void;
		currentValue: ImageExt | null | undefined;
		prefix?: string;
		containerClass?: string;
	};
	let {
		onChange, currentValue, prefix, containerClass,
	}: Props = $props();

	let outputMenuOpen = $state(false);
	let popoverPositionAbove = $state(false);

	let containerRef: HTMLDivElement | null = $state(null);

	const toggleMenu = () => {
		outputMenuOpen = !outputMenuOpen;

		if (outputMenuOpen && containerRef) {
			const containerRect = containerRef.getBoundingClientRect();
			const viewportHeight = window.innerHeight;

			const distanceToTop = containerRect.top;
			const distanceToBottom = viewportHeight - containerRect.bottom;

			popoverPositionAbove = distanceToTop > distanceToBottom;
		}
	};

	const handleOutputChange = (ext: ImageExt) => {
		onChange(ext);
		toggleMenu();
	};
</script>

<div class={['root', containerClass]} bind:this={containerRef}>
	{#if prefix}
		<p>{prefix}</p>
	{/if}
	<div class="buttonWrapper">
		<button
			onclick={toggleMenu}
			class="button"
			aria-label="change output from {currentValue || 'mixed output'}"
		>
			{currentValue || '...'}
		</button>

		{#if outputMenuOpen}
			<div
				class="outputPopover"
				class:popoverAbove={popoverPositionAbove}
				use:focusTrap={{ isActive: true, onClose: toggleMenu }}
			>
				{#each supportedFormatsStore.imageOutputs as ext}
					<button class="extensionButton" onclick={() => handleOutputChange(ext)}>
						{ext}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.root {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.buttonWrapper {
		position: relative;
	}
	.button {
		--padding-inline: 1rem;
		display: flex;
		padding-inline: var(--padding-inline);
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		min-width: calc(4.5ch + var(--padding-inline) * 2);
	}
	.outputPopover {
		--offset: 0.25rem;
		display: flex;
		background-color: var(--background-secondary);
		position: absolute;
		padding: 0.5rem;
		border-radius: 0.5rem;
		gap: 0.25rem;
		flex-direction: column;
		z-index: 1;
		border: 2px solid var(--highlight-button);
		top: calc(100% + var(--offset));
		left: 50%;
		transform: translateX(-50%);

		&.popoverAbove {
			bottom: calc(100% + var(--offset));
			top: auto;
		}
	}
	.extensionButton {
		padding: 0.5rem 1rem;
		border: solid 1px transparent;
		border-radius: 0.5rem;
		transition: background-color 0.1s ease-in-out;
		background-color: var(--background-button);

		&:hover,
		&:focus-visible {
			z-index: 1;
			background-color: var(--background-button-hover);
		}
	}
</style>
