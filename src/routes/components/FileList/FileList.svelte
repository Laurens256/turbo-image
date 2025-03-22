<script lang="ts">
	import { fileStore } from '$stores';
	import { FileListItem, FileSettingsModal, FooterButtons } from './components';

	let maxEntries = $state(100);
	const fileEntries = $derived(Object.entries(fileStore.files));

	let settingsModalFileId = $state<string | null>(null);

	const setSettingsModalFileId = (id: typeof settingsModalFileId) => {
		settingsModalFileId = id;
	};

	const loadMore = () => {
		maxEntries += 100;
	};
</script>

<div class="root">
	<ul >
		{#each fileEntries.slice(0, maxEntries) as [fileId, uploadedFile] (fileId)}
			<FileListItem
				{fileId}
				{uploadedFile}
				onSettingsOpen={() => setSettingsModalFileId(fileId)}
			/>
		{/each}

		{#if fileEntries.length > maxEntries}
			<li>
				<button class="loadMore" onclick={loadMore}>Show more</button>
			</li>
		{/if}
	</ul>

	<FooterButtons />
</div>

<FileSettingsModal
	fileId={settingsModalFileId}
	onClose={() => setSettingsModalFileId(null)}
	isOpen={!!settingsModalFileId}
/>

<style>
	.root {
		--border-radius: 0.5rem;
		--border: 2px solid var(--background-secondary);
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.loadMore {
		width: 100%;
		border-radius: 0;
	}
</style>
