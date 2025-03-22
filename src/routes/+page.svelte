<script lang="ts">
	import { fileStore } from '$stores';
	import { FileActionsHeader, FileList, StartScreen, UnsupportedFilesModal, DownloadCompleteModal } from './components';

	const fileEntries = $derived(Object.entries(fileStore.files));
</script>

<main class="container">
	{#if !fileEntries.length}
		<StartScreen />
	{:else}
		<FileActionsHeader />

<!--		<div class="fileListFooterContainer">-->
		<FileList />
<!--			<FooterButtons />-->
<!--		</div>-->
	{/if}

	<UnsupportedFilesModal />
	<DownloadCompleteModal />
</main>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: min(15vh, 15rem);
		gap: 1rem;
	}
	.fileListFooterContainer {
		--border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
