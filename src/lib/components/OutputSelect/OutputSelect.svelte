<script lang="ts">
	import type { ImageMime } from '$types';
	import { focusTrap } from '$actions';
	import { supportedFormatsStore } from '$stores';
	import { mimeUtil } from '$utils';

	type Props = {
		scrollContainer?: HTMLUListElement;
		isSubtle?: boolean;
		onChange: (mime: ImageMime) => void;
		currentValue: ImageMime | null;
	};
	let { onChange, currentValue, scrollContainer, isSubtle = false }: Props = $props();

	let outputMenuOpen = $state(false);
	let popoverPositionAbove = $state(false);

	let containerRef: HTMLDivElement | null = $state(null);
	let outputButtonRef: HTMLButtonElement | null = $state(null);

	const toggleMenu = () => {
		outputMenuOpen = !outputMenuOpen;

		// determine if the popover should be positioned above or below the button
		if (outputMenuOpen && scrollContainer && containerRef) {
			const scrollRect = scrollContainer.getBoundingClientRect();
			const containerRect = containerRef.getBoundingClientRect();
			const distanceToTop = containerRect.top - scrollRect.top;
			const distanceToBottom = scrollRect.bottom - containerRect.bottom;

			popoverPositionAbove = distanceToTop > distanceToBottom;
		}
	};

	const handleOutputChange = (mime: ImageMime) => {
		onChange(mime);
		toggleMenu();
	};
</script>

<div class="container" bind:this={containerRef}>
	<button
		onclick={toggleMenu}
		class={`button ${isSubtle ? 'subtleButton' : ''}`}
		bind:this={outputButtonRef}
	>
		{`Output: ${currentValue ? mimeUtil.getImageExtensionByMimetype(currentValue) : '...'}`}
	</button>
	<div
		class="outputPopover"
		class:active={outputMenuOpen}
		class:popoverAbove={popoverPositionAbove}
		use:focusTrap={{ isActive: outputMenuOpen, onClose: toggleMenu, returnElement: outputButtonRef }}
	>
		{#each supportedFormatsStore.imageOutputs as mime}
			<button class="extensionButton" onclick={() => handleOutputChange(mime)}>
				{mimeUtil.getImageExtensionByMimetype(mime)}
			</button>
		{/each}
	</div>
</div>

<style>
	.container {
		position: relative;
	}

	.button {
		display: flex;
		align-items: center;
		width: 100%;
		white-space: nowrap;
	}
	.subtleButton {
		background-color: transparent;
		border: solid 2px var(--background-secondary);
		color: var(--text-primary);
		transition: background-color 0.1s ease-in-out;

		&:hover,
		&:focus-visible {
			background-color: var(--background-secondary);
		}
	}

	.outputPopover {
		--offset: 0.75rem;
		display: none;
		background-color: var(--background-secondary);
		position: absolute;
		margin-top: var(--offset);
		padding: 0.5rem;
		border-radius: 0.5rem;
		gap: 0.25rem;
		grid-template-columns: repeat(2, 1fr);
		z-index: 1;
		box-shadow: 0 0 0 0.1rem var(--highlight-button) inset;
		transform-origin: right;
		right: 0.1rem;

		&.active {
			display: grid;
		}

		/* triangle */
		&::before {
			--size: 0.5rem;
			content: '';
			position: absolute;
			top: calc(-1 * var(--size) + 0.1rem);
			right: 1rem;
			width: 0;
			height: 0;
			border-left: var(--size) solid transparent;
			border-right: var(--size) solid transparent;
			border-bottom: var(--size) solid var(--background-secondary);
		}
		&.popoverAbove {
			bottom: calc(100% + var(--offset));

			&::before {
				top: auto;
				bottom: calc(-1 * var(--size));
				border-bottom: none;
				border-top: var(--size) solid var(--background-button);
			}
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
