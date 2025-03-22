<script lang="ts">
	import type { UploadedFile } from '$types';
	import { downloadStore, fileStore } from '$stores';
	import { downloadUtil } from '$utils';
	import { OutputSelect } from '$components';
	import { IconDownload, IconDownloadOff, IconSettings, IconX } from '@tabler/icons-svelte';

	type Props = {
		fileId: string;
		uploadedFile: UploadedFile;
		onSettingsOpen: () => void;
	};
	let { fileId, uploadedFile, onSettingsOpen }: Props = $props();

	const filename = uploadedFile.file.name;

	let downloadState = $derived(downloadStore.getFileDownloadState(fileId));
	let isLoading = $derived(downloadState === 'loading');
	let isError = $derived(downloadState === 'error');

	const handleDownloadClick = async (uploadedFile: UploadedFile) => {
		await downloadUtil.downloadFiles([uploadedFile]);
	};
</script>

<li class="container">
	<h3 class="filename" title={filename}>{filename}</h3>

	<div class="actionsContainer">
		<OutputSelect
			prefix="Output:"
			onChange={(outputExt) => fileStore.updateSettings(fileId, { outputExt })}
			currentValue={uploadedFile.outputExt}
		/>

		<div class="actionsButtonsContainer">
			<button
				class={['downloadButton', 'actionButton', isLoading && 'loadingButton']}
				onclick={() => handleDownloadClick(uploadedFile)}
				aria-label="download image"
				disabled={isLoading}
				title="Download"
			>
				{#if isLoading}
					<div class="loader"></div>
				{:else if isError}<IconDownloadOff />
				{:else}<IconDownload />
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
	</div>
</li>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 3.5rem;
		padding: 0.5rem 1rem;
		border: var(--border);
		border-bottom: none;
		column-gap: 1.5rem;
		row-gap: 1rem;

		&:first-of-type {
			border-top-left-radius: var(--border-radius);
			border-top-right-radius: var(--border-radius);
		}

		@media screen and (max-width: 35rem) {
			flex-direction: column;
			align-items: flex-start;
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

	.actionsContainer {
		display: flex;
		align-items: center;
		gap: 0.75rem;

		@media screen and (max-width: 20rem) {
			flex-direction: column;
			align-items: flex-start;
		}
	}
	.actionsButtonsContainer {
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
</style>
