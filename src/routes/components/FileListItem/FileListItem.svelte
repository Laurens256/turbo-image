<script lang="ts">
	import type { UploadedFile } from '$types';
	import { fileStore } from '$stores';
	import { downloadUtil } from '$utils';
	import { OutputSelect } from '$components';
	import { IconDownload, IconDownloadOff, IconSettings, IconX } from '@tabler/icons-svelte';

	type Props = {
		fileId: string;
		uploadedFile: UploadedFile;
		onSettingsOpen: () => void;
		scrollContainer: HTMLUListElement;
	};
	let { fileId, uploadedFile, onSettingsOpen, scrollContainer }: Props = $props();

	const filename = uploadedFile.file.name;

	const downloadStates = {
		IDLE: 'idle',
		LOADING: 'loading',
		ERROR: 'error',
	};
	type DownloadState = typeof downloadStates[keyof typeof downloadStates];

	let downloadState = $state<DownloadState>(downloadStates.IDLE);
	let isLoading = $derived(downloadState === downloadStates.LOADING);
	let isError = $derived(downloadState === downloadStates.ERROR);

	const handleDownloadClick = async (uploadedFile: UploadedFile) => {
		downloadState = downloadStates.LOADING;
		try {
			await downloadUtil.downloadFiles([uploadedFile]);
			downloadState = downloadStates.IDLE;
			} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				downloadState = downloadStates.IDLE;
			} else {
				downloadState = downloadStates.ERROR;
				console.error(error);
			}
		}
	};
</script>

<li class="container">
	<div class="nameAndOutputContainer">
		<h3 class="filename" title={filename}>{filename}</h3>

		<OutputSelect
			{scrollContainer}
			onChange={(outputMime) => fileStore.updateSettings(fileId, { outputMime })}
			currentValue={uploadedFile.outputMime}
			isSubtle
		/>
	</div>

	<div class="actionButtonsContainer">
		<button
			class="downloadButton actionButton"
			class:loadingButton={isLoading}
			onclick={() => handleDownloadClick(uploadedFile)}
			aria-label="download image"
			disabled={isLoading}
			title="Download"
		>
			{#if isLoading}
				<div class="loader"></div>
			{:else if isError}
				<IconDownloadOff />
			{:else}
				<IconDownload />
			{/if}
		</button>
		<button
			class="settingsButton actionButton"
			aria-label="open image settings"
			onclick={onSettingsOpen}
			title="Settings"
		>
			<IconSettings />
		</button>
		<button
			class="removeButton actionButton"
			onclick={() => fileStore.remove(fileId)}
			aria-label="remove image"
			title="Remove"
		>
			<IconX />
		</button>
	</div>
</li>

<style>
	.container {
		display: flex;
		align-items: center;
		min-height: 3.5rem;
		padding: 0.5rem 1rem;
		border: solid 2px var(--background-secondary);
		column-gap: 1.5rem;
		row-gap: 1rem;

		@media screen and (max-width: 400px) {
			flex-direction: column;
			align-items: flex-start;
			padding: 0.5rem;
		}

		&:first-of-type {
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
		}
		&:last-of-type {
			border-bottom-left-radius: 0.5rem;
			border-bottom-right-radius: 0.5rem;
		}

		&:not(:last-of-type) {
			border-bottom: none;
		}
	}
	.nameAndOutputContainer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-grow: 1;
		gap: 1rem;
		min-width: 0;

		@media screen and (max-width: 400px) {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
		}
	}
	.filename {
		font-size: 1rem;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-overflow: '..';
		direction: rtl;
		max-width: 100%;
	}

	.actionButtonsContainer {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	.actionButton {
		color: var(--text-secondary);
		width: 2rem;
		height: 2rem;
		outline-offset: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s ease-in-out;
		background-color: transparent;
		padding: 0;
		border: none;

		&:not(:disabled):where(:hover, :focus-visible) {
			color: var(--highlight-blue);
			&.removeButton {
				color: var(--highlight-red);
			}
		}
	}

	.loadingButton {
		cursor: progress;
	}
	.loader {
		border: 2px solid var(--text-primary);
		border-top-color: transparent;
		border-radius: 50%;
		width: 1rem;
		aspect-ratio: 1;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* @media screen and (max-width: 400px) {
		.container {
			padding: 0.5rem;
		}

		.actionButtonsContainer {
			flex-direction: column;
			gap: 0.5rem;
		}
	} */
</style>
