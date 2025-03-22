<script lang="ts">
	import type { Snippet } from 'svelte';
	import { handleFileUpload, getFilesFromDataTransferItemList } from './util/index';
	import { SUPPORTED_ARCHIVE_MIMES } from '$constants';
	import type { WithLoader } from './types';
	import { dialogStore } from '$stores';

	type Props = {
		containerClass?: string;
		children: Snippet;
		withFullScreenDropZone?: boolean;
	};

	const isDialogOpen = $derived(dialogStore.isOpen);
	let isLoading = $state(false);
	let { containerClass, children, withFullScreenDropZone = true }: Props = $props();
	let dragEnterElement: HTMLElement | null = $state(null);

	const withLoader: WithLoader = (cb) => {
		return async (...args) => {
			isLoading = true;
			const result = await cb(...args);
			isLoading = false;
			return result;
		};
	};

	const handleClickFileUpload = withLoader(async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		e.preventDefault();
		const files = Array.from(e.currentTarget.files || []);
		await handleFileUpload(files);
	});

	const handleDragFileUpload = withLoader(async (e: DragEvent) => {
		e.preventDefault();
		dragEnterElement = null;

		const files = await getFilesFromDataTransferItemList(e.dataTransfer?.items);
		await handleFileUpload(files);
	});

	const handleFilePaste = withLoader(async (e: ClipboardEvent & { currentTarget: EventTarget & Window; }) => {
		if (!e.clipboardData) {
			return;
		}
		const files = await getFilesFromDataTransferItemList(e.clipboardData.items);
		const filesToUpload = [...files, ...e.clipboardData.files];

		if (filesToUpload.length) {
			e.preventDefault();
			await handleFileUpload([...files, ...e.clipboardData.files]);
		}
	});

	// util for tracking when the user is dragging a file over the document
	const handleDragEnter = (e: DragEvent) => {
		if (withFullScreenDropZone && e.target instanceof HTMLElement) {
			dragEnterElement = e.target;
		}
	};
	const handleDragLeave = (e: DragEvent) => {
		if (withFullScreenDropZone && e.target instanceof HTMLElement && e.target === dragEnterElement) {
			dragEnterElement = null;
		}
	};
	const handleDragEnd = () => {
		dragEnterElement = null;
	};

	const windowHandlers = $derived(withFullScreenDropZone && !isDialogOpen ? {
		ondragenter: handleDragEnter,
		ondragleave: handleDragLeave,
		ondragend: handleDragEnd,
		onpaste: handleFilePaste,
	} : {});
</script>

<svelte:window
	ondragenter={windowHandlers.ondragenter}
	ondragleave={windowHandlers.ondragleave}
	ondragend={windowHandlers.ondragend}
	onpaste={windowHandlers.onpaste}
/>
<input
	class="input"
	class:visible={dragEnterElement}
	oninput={handleClickFileUpload}
	ondrop={handleDragFileUpload}
	id="file_input"
	name="file_input"
	multiple
	type="file"
	accept={['image/*', ...SUPPORTED_ARCHIVE_MIMES].join(',')}
/>
<label for="file_input" class={[containerClass, 'label']}>
	{@render children()}
	{#if isLoading}
		<span class="loaderOverlay">
			<span class="loader"></span>
		</span>
	{/if}
</label>

<style>
	.label {
    cursor: pointer;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.15s ease-in-out;
		background-color: var(--background-button);
		border-radius: 0.5rem;
		border: 2px solid var(--highlight-button);
		padding: 0.5rem 1rem;

		&:hover {
      background-color: var(--background-button-hover);
		}
	}
	.input {
		position: fixed;
		inset: 0;
		z-index: 99;
		opacity: 0;
		pointer-events: none;

		&.visible {
			pointer-events: all;

			& + .label::before {
				content: 'Drop to upload';
				font-size: 3rem;
				position: fixed;
				inset: 1rem;
				background-color: var(--background-backdrop);
				display: flex;
				align-items: center;
				justify-content: center;
				border: dashed 1rem var(--text-primary);
				border-radius: 1rem;
				z-index: 999;
				pointer-events: none;
			}
		}

		&:focus-visible + .label {
			outline: solid 3px var(--highlight-purple);
			outline-offset: 3px;
			background-color: var(--background-button-hover);
		}
	}

	.loaderOverlay {
		display: flex;
		justify-content: center;
		align-items: center;
    position: absolute;
    inset: 0;
		border-radius: inherit;
    background-color: rgba(0, 0, 0, 0.4);
	}
	.loader {
		--size: 1.5rem;
		border: 2px solid var(--white);
		border-top-color: transparent;
		border-radius: 50%;
		width: var(--size);
		height: var(--size);
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
