<script lang="ts">
	import { fileStore } from '$stores';
	import { FileUpload } from '$components';
	import { HeaderButtons, Footer, FileListItem, FileSettingsModal, UnsupportedFilesModal, ErroredFilesModal } from './components';
	import type { UploadedFile } from '$types';

	type SettingsModalFile = { fileId: string; file: UploadedFile };
	let settingsModalFile = $state<SettingsModalFile | null>(null);

	const setSettingsModalFile = (data: SettingsModalFile | null) => {
		settingsModalFile = data;
	};
	let fileListRef: HTMLUListElement | null = $state(null);
	const fileEntries = $derived(Object.entries(fileStore.files));
</script>

<main class="container">
	{#if !fileEntries.length}
		<div class="textContainer">
			<h1>TurboImage</h1>
			<p>Free, unlimited image conversions</p>
		</div>
		<FileUpload containerClass="bigFileUpload">
			Drag and drop your images or click to upload
		</FileUpload>
	{:else}
		<HeaderButtons />

		<ul class="fileList" bind:this={fileListRef}>
			{#each fileEntries as [fileId, uploadedFile] (fileId)}
				<FileListItem
					{fileId}
					{uploadedFile}
					onSettingsOpen={() => setSettingsModalFile({ fileId, file: uploadedFile })}
					scrollContainer={fileListRef}
				/>
			{/each}
		</ul>

		{#if settingsModalFile}
			<FileSettingsModal
				fileId={settingsModalFile.fileId}
				uploadedFile={settingsModalFile.file}
				onClose={() => setSettingsModalFile(null)}
			/>
		{/if}
	{/if}

	<ErroredFilesModal />
	<UnsupportedFilesModal />
	<Footer />
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-block: min(15vh, 15rem) calc(var(--settings-footer-height) + var(--settings-footer-bottom));
		gap: 2.5rem;
	}
	.textContainer {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.container > :global(.bigFileUpload) {
		min-height: 15rem;
		padding: 2rem;
		text-align: center;
	}

	.fileList {
		height: 35rem;
		overflow-y: auto;
		width: 100%;
	}
</style>
