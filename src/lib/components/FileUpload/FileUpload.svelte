<script lang="ts">
	import { supportedFormatsStore } from '$stores';
	import type { Snippet } from 'svelte';
	import { handleFileUpload, getFilesFromDataTransferItemList } from './util/index';

	type Props = {
		containerClass?: string;
		children: Snippet;
		withFullScreenDropZone?: boolean;
	};
	let { containerClass, children, withFullScreenDropZone = true }: Props = $props();
	let dragEnterElement: HTMLElement | null = $state(null);

	const handleClickFileUpload = async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		e.preventDefault();
		const files = Array.from(e.currentTarget.files || []);
		await handleFileUpload(files);
	};

	const handleDragFileUpload = async (e: DragEvent) => {
		e.preventDefault();
		dragEnterElement = null;

		const files = await getFilesFromDataTransferItemList(e.dataTransfer?.items);
		await handleFileUpload(files);
	};

	const handleFilePaste = async (e: ClipboardEvent & { currentTarget: EventTarget & Document; }) => {
		e.preventDefault();

		const files = await getFilesFromDataTransferItemList(e.clipboardData?.items);
		await handleFileUpload(files);
	};

	// util for tracking when the user is dragging a file over the document
	const handleDragEnter = (e: DragEvent) => {
		if (e.target instanceof HTMLElement) {
			dragEnterElement = e.target;
		}
	};
	const handleDragLeave = (e: DragEvent) => {
		if (e.target instanceof HTMLElement && e.target === dragEnterElement) {
			dragEnterElement = null;
		}
	};
</script>

<svelte:document
	ondragenter={withFullScreenDropZone ? handleDragEnter : null}
	ondragleave={withFullScreenDropZone ? handleDragLeave : null}
	onpaste={handleFilePaste}
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
	accept={[supportedFormatsStore.imageInputs, supportedFormatsStore.archiveInputs].join(',')}
/>
<label for="file_input" class="{containerClass} label">
	{@render children()}
</label>

<style>
	.label {
		cursor: pointer;
		position: relative;
		overflow: hidden;
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
</style>
