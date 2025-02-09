<script lang="ts">
	import { FileUpload, OutputSelect } from '$components';
	import { fileStore } from '$stores';
	import { downloadUtil } from '$utils';
	import { IconDownload } from '@tabler/icons-svelte';

	const INITIAL_DOWNLOAD_BUTTON_STATE = { text: 'Download all', disabled: false };

	let files = $derived(Object.values(fileStore.files));

	let documentTitle = $state<string | null>(null);
	let downloadButtonState = $state(INITIAL_DOWNLOAD_BUTTON_STATE);

	const handleDownloadAll = async () => {
		downloadButtonState = {
			text: 'Downloading...',
			disabled: true,
		};

		try {
			await downloadUtil.downloadFiles(files, (count) => {
				downloadButtonState = {
					text: `Downloading (${count} / ${files.length})`,
					disabled: true,
				};
				documentTitle = `Downloading ${count} / ${files.length}`;
			});

			downloadButtonState = {
				text: 'Download complete',
				disabled: false,
			};
			documentTitle = 'Download complete';
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				downloadButtonState = INITIAL_DOWNLOAD_BUTTON_STATE;
				documentTitle = null;
			} else {
				downloadButtonState = {
					text: 'Download failed',
					disabled: false,
				};
				documentTitle = 'Download failed';
			}
		}
	};

	const sharedOutputString = $derived.by(() => {
		const mimeSet = new Set(files.map(({ outputMime }) => outputMime));
		if (mimeSet.size === 1) {
			return files[0].outputMime;
		}
		return null;
	});
</script>

<svelte:head>
	{#if documentTitle}
		<title>{documentTitle}</title>
	{/if}
</svelte:head>
<div class="fileListHeader">
	<div>
		<FileUpload>Add files</FileUpload>
		<button
			class="removeAllButton"
			onclick={fileStore.clear}
			aria-label="clear all images"
		>
			Clear all
		</button>
	</div>
	<div>
		<OutputSelect
			onChange={(outputMime) => fileStore.updateAllSettings({ outputMime })}
			currentValue={sharedOutputString}
		/>
		<button
			class="downloadAllButton"
			onclick={handleDownloadAll}
			disabled={downloadButtonState.disabled}
		>
			{#if !downloadButtonState.disabled}
				<IconDownload size={20} />
			{/if}
			{downloadButtonState.text}
		</button>
	</div>
</div>

<style>
	.fileListHeader {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;

		& > div {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			flex-wrap: wrap;
		}
	}

	.downloadAllButton {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		white-space: nowrap;
	}
</style>
