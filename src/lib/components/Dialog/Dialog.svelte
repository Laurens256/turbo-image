<script lang="ts">
	import { focusTrap } from '$actions';
	import { IconX } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';
	import { dialogStore } from '$stores';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		children: Snippet;
		withCloseButton?: boolean;
	};
	let {
		isOpen, onClose, title, children, withCloseButton = true,
	}: Props = $props();

	$effect(() => {
		dialogStore.isOpen = isOpen;
		return () => dialogStore.isOpen = false;
	});

	const handleBackDropClick = (e: MouseEvent) => {
		// make sure event target is the container and not the dialog itself
		if (e.currentTarget === e.target) {
			onClose();
		}
	};
</script>

<div
	class="container"
	class:active={isOpen}
	inert={!isOpen}
	onclick={handleBackDropClick}
	role="presentation"
	use:focusTrap={{ isActive: isOpen, onClose }}
>
	<dialog class="dialog" open={isOpen}>
		<header class="header">
			<h2>{title}</h2>
			{#if withCloseButton}
				<button class="closeButton" onclick={onClose} aria-label="close dialog">
					<IconX size={24} />
				</button>
			{/if}
		</header>

		{@render children()}
	</dialog>
</div>

<style>
	.container {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 998;
		&.active {
			pointer-events: all;
			background-color: rgba(0, 0, 0, 0.9);
		}
	}

	.dialog {
		top: min(8rem, 12vh);
		padding: 2rem;
		background-color: var(--background-primary);
		border-radius: 0.5rem;
		width: min(95%, 35rem);
		animation: popIn 0.2s ease-out;
		margin-inline: auto;
		border: 0;
		box-shadow: 0 0 0 0.2rem var(--highlight-dialog) inset;

		&::backdrop {
			display: none;
		}
	}

	@keyframes popIn {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		gap: 0.5rem;
	}
	.closeButton {
		transition: color 0.1s ease-in-out;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background-color: transparent;
		border: none;

		&:hover,
		&:focus-visible {
			color: var(--text-primary);
		}
	}
</style>
